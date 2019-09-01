<%_ var packageAddress = options.serverSetup.packageAddress _%>
<%_ var moduleName = options.serverSetup.moduleName _%>
<%_ var userTable = options.serverSetup.userTable _%>
<%_ var accountColumn = options.serverSetup.accountColumn _%>
<%_ var passwordColumn = options.serverSetup.passwordColumn _%>
package <%-packageAddress%>.<%-moduleName%>.auth

import <%-packageAddress%>.app.Cast
import <%-packageAddress%>.app.Env
import <%-packageAddress%>.param.DefaultParam
import <%-packageAddress%>.exception.response.BadRequestException
import <%-packageAddress%>.exception.response.NotFoundException
import <%-packageAddress%>.exception.response.UnauthorizedException
import <%-packageAddress%>.model.resource.<%-userTable.modelName%>
import <%-packageAddress%>.<%-moduleName%>.context.RequestContext
import <%-packageAddress%>.<%-moduleName%>.mail.RecoverPasswordMail
import <%-packageAddress%>.<%-moduleName%>.request.AuthRequest
import <%-packageAddress%>.<%-moduleName%>.request.ChangePasswordRequest
import <%-packageAddress%>.<%-moduleName%>.request.ResetPasswordRequest
import <%-packageAddress%>.<%-moduleName%>.request.RecoverPasswordByMailRequest
import <%-packageAddress%>.<%-moduleName%>.response.AuthResponse
import br.com.simpli.tools.SecurityUtils
import java.util.regex.Pattern
import java.util.Date
import java.util.Calendar

/**
 * Responsible for Authentication operations
 * @author Simpli CLI generator
 */
class AuthProcess(val context: RequestContext) {

    val dao = AuthDao(context.con)

    /**
     * Get the authentication information by the token
     */
    @Throws(UnauthorizedException::class)
    fun authenticate(param: DefaultParam.Auth): AuthResponse {
        val token = extractToken(param.authorization ?: "") ?: throw UnauthorizedException(context.lang["invalid_token"])
        try {
            val request = tokenToRequest(token)
            val id = getId(request)
            val <%-userTable.instanceName%> = get<%-userTable.modelName%>(id)

            return AuthResponse(token, <%-userTable.instanceName%>)
        } catch (e: BadRequestException) {
            throw UnauthorizedException(context.lang.pleaseLogin())
        } catch (e: NotFoundException) {
            throw UnauthorizedException(context.lang.pleaseLogin())
        }
    }

    /**
     * Get the authentication information according to a login attempt
     */
    @Throws(UnauthorizedException::class)
    fun signIn(request: AuthRequest): AuthResponse {
        try {
            val token = requestToToken(request)
            val id = getId(request)
            val <%-userTable.instanceName%> = get<%-userTable.modelName%>(id)

            return AuthResponse(token, <%-userTable.instanceName%>)
        } catch (e: NotFoundException) {
            throw UnauthorizedException(context.lang.invalidLogin())
        }
    }

    class TokenForgottenPassword(val <%-accountColumn.name%>: <%-accountColumn.kotlinType%>, val date: Date = Date())

    /**
     * Send an e-mail in order to reset the password
     */
    @Throws(BadRequestException::class)
    fun recoverPasswordByMail(request: RecoverPasswordByMailRequest): Long {
        request.validate(context.lang)

        val <%-userTable.instanceName%> = dao.get<%-userTable.modelName%>ByEmail("${request.<%-accountColumn.name%>}") ?: throw BadRequestException(context.lang.emailNotFound())

        val json = Cast.classToJson(TokenForgottenPassword("${<%-userTable.instanceName%>.<%-accountColumn.name%>}"))
        val encrypted = SecurityUtils.encrypt(json, Env.props.encryptHash)
        val hash = encrypted?.replace("/", "%2F") ?: "invalid_hash"

        RecoverPasswordMail(context.lang, <%-userTable.instanceName%>, hash).send()

        return 1L
    }

    /**
     * Reset the password
     */
    @Throws(BadRequestException::class)
    fun resetPassword(request: ResetPasswordRequest): String {
        request.validate(context.lang)

        val hashResolved = request.hash?.replace(" ", "+") ?: ""
        val token = SecurityUtils.decrypt(hashResolved, Env.props.encryptHash) ?: throw BadRequestException(context.lang.invalidToken())

        val tokenForgottenPassword = Cast.jsonToClass(token, TokenForgottenPassword::class.java)

        val calendar = Calendar.getInstance()
        calendar.time = tokenForgottenPassword.date
        calendar.add(Calendar.DAY_OF_MONTH, Env.props.forgottenPasswordTokenLife)

        // token expires after x days
        if (calendar.time.before(Date())) throw BadRequestException(context.lang.expiredToken())

        request.newPassword?.also {
            dao.update<%-userTable.modelName%>Password(tokenForgottenPassword.<%-accountColumn.name%>, it)
        }

        return requestToToken(AuthRequest(tokenForgottenPassword.<%-accountColumn.name%>, request.newPassword))
    }

    /**
     * Change the password
     */
    @Throws(BadRequestException::class)
    fun changePassword(request: ChangePasswordRequest, auth: AuthResponse): Long {
        val id = auth.id
        val <%-userTable.instanceName%> = auth.<%-userTable.instanceName%>
        val <%-accountColumn.name%> = <%-userTable.instanceName%>.<%-accountColumn.name%>

        request.validate(context.lang)

        request.newPassword?.also { newPassword ->
            request.currentPassword?.also { currentPassword ->
                val idVerify = dao.getIdOf<%-userTable.modelName%>(<%-accountColumn.name%>, currentPassword)
                if (id != idVerify) throw BadRequestException(context.lang["wrong_password"])

                dao.update<%-userTable.modelName%>Password(<%-accountColumn.name%>, newPassword)
            }
        }

        return 1L
    }

    /**
     * Get the ID by auth request
     */
    @Throws(BadRequestException::class, NotFoundException::class)
    fun getId(request: AuthRequest): Long {
        request.validate(context.lang)

        return dao.getIdOf<%-userTable.modelName%>("${request.<%-accountColumn.name%>}", "${request.<%-passwordColumn.name%>}") ?: throw NotFoundException(context.lang["user_id_not_found"])
    }

    /**
     * Get the user by ID
     */
    @Throws(NotFoundException::class)
    fun get<%-userTable.modelName%>(<%-userTable.idColumn.name%>: <%-userTable.idColumn.kotlinType%>): <%-userTable.modelName%> {
        return dao.get<%-userTable.modelName%>(<%-userTable.idColumn.name%>) ?: throw NotFoundException(context.lang["user_not_found"])
    }

    companion object {
        /**
         * Transforms AuthRequest object into token string
         */
        fun requestToToken(request: AuthRequest): String {
            val empty = "invalid_token"
            return try {
                val json = Cast.classToJson(request)
                val encrypted = SecurityUtils.encrypt(json, Env.props.encryptHash) ?: empty
                val token = SecurityUtils.encode(encrypted, "UTF-8") ?: empty

                token
            } catch (e: Exception) {
                empty
            }
        }

        /**
         * Transforms token string into AuthRequest object
         */
        fun tokenToRequest(token: String): AuthRequest {
            val empty = AuthRequest(null, null)
            return try {
                val encrypted = SecurityUtils.decode(token, "UTF-8")
                val json = SecurityUtils.decrypt(encrypted ?: return empty, Env.props.encryptHash)
                val request = Cast.jsonToClass(json ?: return empty, AuthRequest::class.java)

                request
            } catch (e: Exception) {
                empty
            }
        }

        /**
         * Extracts token from the header
         */
        fun extractToken(authorization: String): String? {
            val matcher = Pattern.compile("Bearer (.*)").matcher(authorization)
            return if (matcher.find()) matcher.group(1) else null
        }
    }
}

<%_ var packageAddress = options.serverSetup.packageAddress _%>
<%_ var moduleName = options.serverSetup.moduleName _%>
<%_ var userTable = options.serverSetup.userTable _%>
<%_ var accountColumn = options.serverSetup.accountColumn _%>
<%_ var passwordColumn = options.serverSetup.passwordColumn _%>
package <%-packageAddress%>.<%-moduleName%>.auth

import <%-packageAddress%>.app.Env.ENCRYPT_HASH
import <%-packageAddress%>.app.Env.FORGOTTEN_PASSWORD_TOKEN_LIFE
import <%-packageAddress%>.wrapper.ProcessWrapper
import <%-packageAddress%>.exception.response.BadRequestException
import <%-packageAddress%>.exception.response.NotFoundException
import <%-packageAddress%>.exception.response.UnauthorizedException
import <%-packageAddress%>.model.resource.<%-userTable.modelName%>
import <%-packageAddress%>.app.Cast.classToJson
import <%-packageAddress%>.app.Cast.jsonToClass
import <%-packageAddress%>.<%-moduleName%>.mail.RecoverPasswordMail
import <%-packageAddress%>.<%-moduleName%>.request.AuthRequest
import <%-packageAddress%>.<%-moduleName%>.request.ChangePasswordRequest
import <%-packageAddress%>.<%-moduleName%>.request.ResetPasswordRequest
import <%-packageAddress%>.<%-moduleName%>.request.RecoverPasswordByMailRequest
import <%-packageAddress%>.<%-moduleName%>.response.AuthResponse
import br.com.simpli.tools.SecurityUtils.decode
import br.com.simpli.tools.SecurityUtils.decrypt
import br.com.simpli.tools.SecurityUtils.encode
import br.com.simpli.tools.SecurityUtils.encrypt
import java.util.Date
import java.util.Calendar

/**
 * Authentication business logic
 * @author Simpli CLI generator
 */
class AuthProcess : ProcessWrapper() {

    lateinit var dao: AuthDao

    override fun onAssign() {
        dao = AuthDao(con, lang)
    }

    /**
     * Get the authentication information by the token
     */
    @Throws(UnauthorizedException::class)
    fun auth(token: String): AuthResponse {
        try {
            val request = tokenToRequest(token)
            val id = getId(request)
            val <%-userTable.instanceName%> = get<%-userTable.modelName%>(id)

            return AuthResponse(token, <%-userTable.instanceName%>)
        } catch (e: BadRequestException) {
            throw UnauthorizedException(lang.pleaseLogin())
        } catch (e: NotFoundException) {
            throw UnauthorizedException(lang.pleaseLogin())
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
            throw UnauthorizedException(lang.invalidLogin())
        }
    }

    class TokenForgottenPassword(val <%-accountColumn.name%>: <%-accountColumn.kotlinType%>, val date: Date = Date())

    /**
     * Send an e-mail in order to reset the password
     */
    @Throws(BadRequestException::class)
    fun recoverPasswordByMail(request: RecoverPasswordByMailRequest): Long {
        request.validate(lang)

        val <%-userTable.instanceName%> = dao.get<%-userTable.modelName%>ByEmail(request.<%-accountColumn.name%>!!) ?: throw BadRequestException(lang.emailNotFound())

        val json = classToJson(TokenForgottenPassword(<%-userTable.instanceName%>.<%-accountColumn.name%>.toString()))
        val encrypted = encrypt(json, ENCRYPT_HASH)
        val hash = encrypted?.replace("/", "%2F") ?: "invalid_hash"

        RecoverPasswordMail(lang, <%-userTable.instanceName%>, hash).send()

        return 1L
    }

    /**
     * Reset the password
     */
    @Throws(BadRequestException::class)
    fun resetPassword(request: ResetPasswordRequest): String {
        request.validate(lang)

        val hashResolved = request.hash!!.replace(" ", "+")
        val token = decrypt(hashResolved, ENCRYPT_HASH) ?: throw BadRequestException(lang.invalidToken())

        val tokenForgottenPassword = jsonToClass(token, TokenForgottenPassword::class.java)

        val calendar = Calendar.getInstance()
        calendar.time = tokenForgottenPassword.date
        calendar.add(Calendar.DAY_OF_MONTH, FORGOTTEN_PASSWORD_TOKEN_LIFE)

        // token expires after x days
        if (calendar.time.before(Date())) throw BadRequestException(lang.expiredToken())

        dao.update<%-userTable.modelName%>Password(tokenForgottenPassword.<%-accountColumn.name%>, request.newPassword!!)

        return requestToToken(AuthRequest(tokenForgottenPassword.<%-accountColumn.name%>, request.newPassword))
    }

    /**
     * Change the password
     */
    @Throws(BadRequestException::class)
    fun changePassword(request: ChangePasswordRequest, auth: AuthResponse): Long {
        val id = auth.id
        val <%-userTable.instanceName%> = auth.<%-userTable.instanceName%>
        val <%-accountColumn.name%> = <%-userTable.instanceName%>.<%-accountColumn.name%> ?: throw BadRequestException(lang.cannotBeNull("<%-accountColumn.name%>"))

        request.validate(lang)

        val newPassword = request.newPassword!!
        val currentPassword = request.currentPassword!!

        val idVerify = dao.getIdOf<%-userTable.modelName%>(<%-accountColumn.name%>, currentPassword)
        if (id != idVerify) throw BadRequestException(lang["wrong_password"])

        dao.update<%-userTable.modelName%>Password(<%-accountColumn.name%>, newPassword)

        return 1L
    }

    /**
     * Get the ID by auth request
     */
    @Throws(BadRequestException::class, NotFoundException::class)
    fun getId(request: AuthRequest): Long {
        request.validate(lang)

        return dao.getIdOf<%-userTable.modelName%>(request.<%-accountColumn.name%>!!, request.<%-passwordColumn.name%>!!) ?: throw NotFoundException(lang["user_id_not_found"])
    }

    /**
     * Get the user by ID
     */
    @Throws(NotFoundException::class)
    fun get<%-userTable.modelName%>(<%-userTable.idColumn.name%>: <%-userTable.idColumn.kotlinType%>): <%-userTable.modelName%> {
        return dao.get<%-userTable.modelName%>(<%-userTable.idColumn.name%>) ?: throw NotFoundException(lang["user_not_found"])
    }

    companion object {
        /**
         * Transform AuthRequest object into token string
         */
        fun requestToToken(request: AuthRequest): String {
            val empty = "invalid_token"
            return try {
                val json = classToJson(request)
                val encrypted = encrypt(json, ENCRYPT_HASH) ?: empty
                val token = encode(encrypted, "UTF-8") ?: empty

                token
            } catch (e: Exception) {
                empty
            }
        }

        /**
         * Transform token string into AuthRequest object
         */
        fun tokenToRequest(token: String): AuthRequest {
            val empty = AuthRequest(null, null)
            return try {
                val encrypted = decode(token, "UTF-8")
                val json = decrypt(encrypted ?: return empty, ENCRYPT_HASH)
                val request = jsonToClass(json ?: return empty, AuthRequest::class.java)

                request
            } catch (e: Exception) {
                empty
            }
        }
    }
}

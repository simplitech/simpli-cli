<%_ var packageAddress = options.serverSetup.packageAddress _%>
<%_ var moduleName = options.serverSetup.moduleName _%>
<%_ var userTable = options.serverSetup.userTable _%>
<%_ var accountColumn = options.serverSetup.accountColumn _%>
<%_ var passwordColumn = options.serverSetup.passwordColumn _%>
package <%-packageAddress%>.<%-moduleName%>.process

import <%-packageAddress%>.dao.LoginServiceDao
import com.google.gson.Gson
import java.util.*
import java.sql.Connection
import <%-packageAddress%>.<%-moduleName%>.mail.ResetPasswordMail
import <%-packageAddress%>.<%-moduleName%>.response.LoginResp
import <%-packageAddress%>.exception.HttpException
import <%-packageAddress%>.model.<%-userTable.modelName%>
import br.com.simpli.model.LanguageHolder
import br.com.simpli.tools.SecurityUtils
import javax.ws.rs.core.Response

/**
 * User Login Services
 * @author Simpli© CLI generator
 */
class LoginService(private val con: Connection, private val lang: LanguageHolder, private val clientVersion: String) {

    fun auth(token: String?): LoginResp {
        val lHolder: LoginSerialized? = tokenToLogin(token)
        val <%-accountColumn.name%>: <%-accountColumn.kotlinType%>? = lHolder?.<%-accountColumn.name%>
        val <%-passwordColumn.name%>: <%-passwordColumn.kotlinType%>? = lHolder?.<%-passwordColumn.name%>
        val id = getId(<%-accountColumn.name%>, <%-passwordColumn.name%>)
        val <%-userTable.instanceName%> = get<%-userTable.modelName%>(id)

        if (id == 0L) {
            throw HttpException(lang.invalidLogin(), Response.Status.UNAUTHORIZED)
        }

        return LoginResp(token, id, <%-userTable.instanceName%>)
    }

    fun signIn(<%-accountColumn.name%>: <%-accountColumn.kotlinType%>?, <%-passwordColumn.name%>: <%-passwordColumn.kotlinType%>?): LoginResp {
        val token = loginToToken(<%-accountColumn.name%>, <%-passwordColumn.name%>)
        val id = getId(<%-accountColumn.name%>, <%-passwordColumn.name%>)
        val <%-userTable.instanceName%> = get<%-userTable.modelName%>(id)

        if (id == 0L) {
            throw HttpException(lang.invalidLogin(), Response.Status.UNAUTHORIZED)
        }

        return LoginResp(token, id, <%-userTable.instanceName%>)
    }

    fun resetPassword(<%-accountColumn.name%>: <%-accountColumn.kotlinType%>?): Long {
        val dao = LoginServiceDao(con, lang)

        if (<%-accountColumn.name%> === null) {
            throw HttpException(lang.cannotBeNull("<%-accountColumn.capitalizedName%>"), Response.Status.NOT_ACCEPTABLE)
        }

        val user = dao.getUserByEmail(<%-accountColumn.name%>)

        if (user === null || user.<%-accountColumn.name%> === null) {
            throw HttpException(lang.emailNotFound(), Response.Status.NOT_ACCEPTABLE)
        }

        var hash = Gson().toJson(TokenForgottenPassword(user.<%-accountColumn.name%> as String))
        hash = SecurityUtils.encrypt(hash, LoginService.CRIPTOGRAPHY_HASH)
        hash = hash.replace("/", "%2F")

        ResetPasswordMail("http://localhost:8181", lang, user, hash).send()

        return 1L
    }

    fun recoverPassword(<%-passwordColumn.name%>: <%-accountColumn.kotlinType%>?, hash: String?): String? {
        val dao = LoginServiceDao(con, lang)

        if (<%-passwordColumn.name%>.isNullOrEmpty()) {
            throw HttpException(lang.cannotBeNull("<%-passwordColumn.capitalizedName%>"), Response.Status.NOT_ACCEPTABLE)
        }

        if (hash.isNullOrEmpty()) {
            throw HttpException(lang.cannotBeNull("Hash"), Response.Status.NOT_ACCEPTABLE)
        }

        val hashResolved = hash!!.replace(" ", "+")
        val token = SecurityUtils.decrypt(hashResolved, LoginService.CRIPTOGRAPHY_HASH)

        if (token === null) {
            throw HttpException(lang.invalidToken(), Response.Status.NOT_ACCEPTABLE)
        }

        val objToken = Gson().fromJson<TokenForgottenPassword>(token, TokenForgottenPassword::class.java)

        if (objToken === null) {
            throw HttpException(lang.expiredToken(), Response.Status.NOT_ACCEPTABLE)
        }

        val calendar = Calendar.getInstance()
        calendar.time = objToken.date
        calendar.add(Calendar.DAY_OF_MONTH, 15)
        val dataExpiracao = calendar.time

        //token expires after 15 days
        if (dataExpiracao.before(Date())) {
            throw HttpException(lang.expiredToken(), Response.Status.NOT_ACCEPTABLE)
        }

        dao.updateUserPassword(objToken.<%-accountColumn.name%>, <%-passwordColumn.name%>!!)

        return loginToToken(objToken.<%-accountColumn.name%>, <%-passwordColumn.name%>)
    }

    fun getId(<%-accountColumn.name%>: <%-accountColumn.kotlinType%>?, <%-passwordColumn.name%>: <%-passwordColumn.kotlinType%>?): Long {
        val dao = LoginServiceDao(con, lang)

        return dao.getIdOf<%-userTable.modelName%>(<%-accountColumn.name%>, <%-passwordColumn.name%>)
    }

    fun get<%-userTable.modelName%>(id: Long): <%-userTable.modelName%>? {
        val dao = LoginServiceDao(con, lang)

        return dao.get<%-userTable.modelName%>(id)
    }

    fun allowAccess(token: String?): LoginInfo {
        val login = tokenToLogin(token) ?: throw HttpException(lang.pleaseLogin(), Response.Status.UNAUTHORIZED)

        val id = getId(login.<%-accountColumn.name%>, login.<%-passwordColumn.name%>)

        if (id == 0L) {
            throw HttpException(lang.pleaseLogin(), Response.Status.UNAUTHORIZED)
        }

        return LoginInfo(id, login)
    }

    class LoginSerialized(val <%-accountColumn.name%>: <%-accountColumn.kotlinType%>?, val <%-passwordColumn.name%>: <%-passwordColumn.kotlinType%>?, val hash: String? = "")

    class LoginInfo {
        val id: Long
        val loginSerialized: LoginSerialized

        constructor(id: Long, loginSerialized: LoginSerialized) {
            this.loginSerialized = loginSerialized
            this.id = id
        }

        constructor(id: Long, email: String?, password: String?, hash: String? = "") {
            this.loginSerialized = LoginSerialized(email, password, hash)
            this.id = id
        }
    }

    class TokenForgottenPassword (val <%-accountColumn.name%>: <%-accountColumn.kotlinType%>, val date: Date? = Date())

    companion object {

        fun loginToToken(<%-accountColumn.name%>: <%-accountColumn.kotlinType%>?, <%-passwordColumn.name%>: <%-passwordColumn.kotlinType%>?): String? {
            var token = Gson().toJson(LoginSerialized(<%-accountColumn.name%>, <%-passwordColumn.name%>))
            token = SecurityUtils.encrypt(token, CRIPTOGRAPHY_HASH)

            token = SecurityUtils.encode(token, "UTF-8")

            return token
        }

        fun tokenToLogin(tokenP: String?): LoginSerialized? {
            var token: String? = tokenP ?: return null

            token = SecurityUtils.decode(token ?: "", "UTF-8")
            token = SecurityUtils.decrypt(token ?: "", CRIPTOGRAPHY_HASH)

            if (token == null) {
                return null
            }

            try {
                return Gson().fromJson(token, LoginSerialized::class.java)
            } catch (e: Exception) {
                return null
            }
        }

        val CRIPTOGRAPHY_HASH = "<%-options.serverSetup.uuid()%>"
    }
}
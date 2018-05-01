<%_ var packageAddress = options.serverSetup.packageAddress _%>
<%_ var moduleName = options.serverSetup.moduleName _%>
<%_ var userTable = options.serverSetup.userTable _%>
<%_ var accountColumn = options.serverSetup.accountColumn _%>
<%_ var passwordColumn = options.serverSetup.passwordColumn _%>
package <%-packageAddress%>.<%-moduleName%>.process

import <%-packageAddress%>.dao.LoginServiceDao
import com.google.gson.Gson
import java.sql.Connection
import <%-packageAddress%>.<%-moduleName%>.response.LoginResp
import <%-packageAddress%>.exception.HttpException
import <%-packageAddress%>.model.<%-userTable.modelName%>
import com.simpli.model.LanguageHolder
import com.simpli.model.RespException
import com.simpli.tools.SecurityUtils
import javax.ws.rs.core.Response

/**
 * User Login Services
 * @author Simpli© CLI generator
 */
class LoginService(private val con: Connection, private val lang: LanguageHolder, private val clientVersion: String) {

    fun auth(token: String?): LoginResp {
        val lHolder: LoginHolder? = tokenToLogin(token)
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

    fun allowAccess(token: String?): LoginHolderWithId {
        val login = tokenToLogin(token) ?: throw HttpException(lang.pleaseLogin(), Response.Status.UNAUTHORIZED)

        val id = getId(login.<%-accountColumn.name%>, login.<%-passwordColumn.name%>)

        if (id == 0L) {
            throw HttpException(lang.pleaseLogin(), Response.Status.UNAUTHORIZED)
        }

        return LoginHolderWithId(login, id)
    }

    fun getId(<%-accountColumn.name%>: <%-accountColumn.kotlinType%>?, <%-passwordColumn.name%>: <%-passwordColumn.kotlinType%>?): Long {
        val dao = LoginServiceDao(con, lang)

        return dao.getIdOf<%-userTable.modelName%>(<%-accountColumn.name%>, <%-passwordColumn.name%>)
    }

    fun get<%-userTable.modelName%>(id: Long): <%-userTable.modelName%>? {
        val dao = LoginServiceDao(con, lang)

        return dao.get<%-userTable.modelName%>(id)
    }

    fun loginToToken(<%-accountColumn.name%>: <%-accountColumn.kotlinType%>?, <%-passwordColumn.name%>: <%-passwordColumn.kotlinType%>?): String? {
        var token = Gson().toJson(LoginHolder(<%-accountColumn.name%>, <%-passwordColumn.name%>))
        token = SecurityUtils.encrypt(token, CRIPTOGRAPHY_HASH)

        token = SecurityUtils.encode(token, "UTF-8")

        return token
    }

    fun tokenToLogin(tokenP: String?): LoginHolder? {
        var token: String? = tokenP ?: return null

        token = SecurityUtils.decode(token ?: "", "UTF-8")
        token = SecurityUtils.decrypt(token ?: "", CRIPTOGRAPHY_HASH)

        if (token == null) {
            return null
        }

        try {
            return Gson().fromJson(token, LoginHolder::class.java)
        } catch (e: Exception) {
            return null
        }

    }

    class LoginHolder(val <%-accountColumn.name%>: <%-accountColumn.kotlinType%>?, val <%-passwordColumn.name%>: <%-passwordColumn.kotlinType%>?)

    class LoginHolderWithId(val loginHolder: LoginHolder, val id: Long)

    companion object {
        val CRIPTOGRAPHY_HASH = "<%-options.serverSetup.uuid()%>"
    }
}
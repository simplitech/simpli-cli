package br.com.martinlabs.usecase.crud.process


import br.com.martinlabs.usecase.dao.LoginServiceDao
import com.google.gson.Gson
import java.sql.Connection
import br.com.martinlabs.usecase.crud.response.LoginResp
import br.com.martinlabs.usecase.exception.HttpException
import br.com.martinlabs.usecase.model.User
import com.simpli.model.LanguageHolder
import com.simpli.model.RespException
import com.simpli.tools.SecurityUtils
import javax.ws.rs.core.Response


/**
 * User Login Services
 * @author martinlabs CRUD generator
 */
class LoginServices(private val con: Connection, private val lang: LanguageHolder, private val clientVersion: String) {

    fun auth(token: String?): LoginResp {
        val lHolder: LoginHolder? = tokenToLogin(token)
        val account: String? = lHolder?.account
        val password: String? = lHolder?.password
        val id = getId(account, password)
        val user = getUser(id)

        if (id == 0L) {
            throw HttpException(lang.invalidLogin(), Response.Status.UNAUTHORIZED)
        }

        return LoginResp(token, id, user)
    }

    fun signIn(account: String?, password: String?): LoginResp {
        val token = loginToToken(account, password)
        val id = getId(account, password)
        val user = getUser(id)

        if (id == 0L) {
            throw HttpException(lang.invalidLogin(), Response.Status.UNAUTHORIZED)
        }

        return LoginResp(token, id, user)
    }

    fun allowAccess(token: String?): LoginHolderWithId {
        val login = tokenToLogin(token) ?: throw HttpException(lang.pleaseLogin(), Response.Status.UNAUTHORIZED)

        val id = getId(login.account, login.password)

        if (id == 0L) {
            throw HttpException(lang.pleaseLogin(), Response.Status.UNAUTHORIZED)
        }

        return LoginHolderWithId(login, id)
    }

    fun getId(account: String?, password: String?): Long {
        val dao = LoginServiceDao(con, lang)

        return dao.getIdOfUser(account, password)
    }

    fun getUser(id: Long): User? {
        val dao = LoginServiceDao(con, lang)

        return dao.getUser(id)
    }

    fun loginToToken(account: String?, password: String?): String? {
        var token = Gson().toJson(LoginHolder(account, password))
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

    class LoginHolder(val account: String?, val password: String?)

    class LoginHolderWithId(val loginHolder: LoginHolder, val id: Long)

    companion object {

        val CRIPTOGRAPHY_HASH = "gueb6u0a51x7irizfr"
    }
}
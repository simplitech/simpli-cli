package br.com.martinlabs.usecase.crud.process

import br.com.martinlabs.usecase.model.User
import br.com.martinlabs.usecase.crud.response.UserResp
import br.com.martinlabs.usecase.dao.UserDao
import com.google.common.base.Strings
import com.simpli.model.LanguageHolder
import com.simpli.model.PagedResp
import com.simpli.model.RespException
import java.sql.Connection

/**
 * User business logic
 * @author martinlabs CRUD generator
 */
class UserProcess(private val con: Connection, private val lang: LanguageHolder, private val clientVersion: String) {

    private val loginS = LoginServices(con, lang, clientVersion)

    fun list(
        token: String?, 
        queryP: String?,
        page: Int?,
        limit: Int?,
        orderRequest: String?,
        asc: Boolean?): PagedResp<User> {
        //TODO: review generated method
        var query = queryP
        
        if (query != null) {
            query = query.replace("[.,:\\-\\/]".toRegex(), "")
        }

        loginS.allowAccess(token)

        val dao = UserDao(con, lang)

        val listUser = dao.list(query, page, limit, orderRequest, asc)

        val resp = PagedResp(listUser)

        if (!Strings.isNullOrEmpty(query)) {
            dao.count(query)?.let {
                count -> resp.recordsTotal = count
            }
        } else {
            dao.count()?.let{
                count -> resp.recordsTotal = count
            }
        }

        return resp
    }

    fun getOne(idUserPk: Long?, token: String?): UserResp {
        //TODO: review generated method
        loginS.allowAccess(token)

        val userDao = UserDao(con, lang)
        val resp = UserResp()

        if (idUserPk != null && idUserPk > 0) {
            val user = userDao.getOne(idUserPk)
            resp.user = user
        }

        return resp
    }

    fun persist(user: User, token: String?): Long {
        //TODO: review generated method
        loginS.allowAccess(token)

        val dao = UserDao(con, lang)

        val idUser: Long
        if (user.idUserPk > 0) {
            user.validate(true, lang)
            idUser = user.idUserPk
            
            dao.updateUser(user)
        } else {
            user.validate(false, lang)
            idUser = dao.insert(user)
            user.idUserPk = idUser
        }

        return idUser
    }

}

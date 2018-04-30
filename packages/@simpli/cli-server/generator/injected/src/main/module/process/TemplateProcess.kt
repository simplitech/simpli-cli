package br.com.martinlabs.usecase.crud.process

import br.com.martinlabs.usecase.model.Principal
import br.com.martinlabs.usecase.model.Tag
import br.com.martinlabs.usecase.crud.response.PrincipalResp
import br.com.martinlabs.usecase.dao.PrincipalDao
import br.com.martinlabs.usecase.dao.GrupoDoPrincipalDao
import br.com.martinlabs.usecase.dao.TagPrincipalDao
import br.com.martinlabs.usecase.dao.TagDao
import br.com.martinlabs.usecase.exception.HttpException
import com.google.common.base.Strings
import com.simpli.model.LanguageHolder
import com.simpli.model.PagedResp
import com.simpli.model.RespException
import java.sql.Connection
import javax.ws.rs.core.Response

/**
 * Principal business logic
 * @author martinlabs CRUD generator
 */
class PrincipalProcess(private val con: Connection, private val lang: LanguageHolder, private val clientVersion: String) {

    private val loginS = LoginService(con, lang, clientVersion)

    fun list(
        token: String?, 
        queryP: String?,
        page: Int?,
        limit: Int?,
        orderRequest: String?,
        asc: Boolean?): PagedResp<Principal> {
        //TODO: review generated method
        var query = queryP
        
        if (query != null) {
            query = query.replace("[.,:\\-\\/]".toRegex(), "")
        }

        loginS.allowAccess(token)

        val dao = PrincipalDao(con, lang)

        val listPrincipal = dao.list(query, page, limit, orderRequest, asc)

        val resp = PagedResp(listPrincipal)

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

    fun getOne(idPrincipalPk: Long?, token: String?): PrincipalResp {
        //TODO: review generated method
        loginS.allowAccess(token)

        val principalDao = PrincipalDao(con, lang)
        val grupoDoPrincipalDao = GrupoDoPrincipalDao(con, lang)
        val tagPrincipalDao = TagPrincipalDao(con, lang)
        val tagDao = TagDao(con, lang)
        val resp = PrincipalResp()

        if (idPrincipalPk != null && idPrincipalPk > 0) {
            val principal = principalDao.getOne(idPrincipalPk)
            if (principal != null) {
                principal.tagPrincipal = tagPrincipalDao.listTagOfPrincipal(idPrincipalPk)
            }

            resp.principal = principal
        }
        resp.allGrupoDoPrincipal = grupoDoPrincipalDao.list()

        resp.allTag = tagDao.list()


        return resp
    }

    fun persist(principal: Principal, token: String?): Long {
        //TODO: review generated method
        loginS.allowAccess(token)

        val dao = PrincipalDao(con, lang)

        if (dao.existUnico(principal.unico, principal.idPrincipalPk)) {
            throw HttpException(lang.alreadyExist("Unico"), Response.Status.NOT_ACCEPTABLE)
        }

        val idPrincipal: Long
        if (principal.idPrincipalPk > 0) {
            principal.validate(true, lang)
            idPrincipal = principal.idPrincipalPk
            
            dao.updatePrincipal(principal)
        } else {
            principal.validate(false, lang)
            idPrincipal = dao.insert(principal)
            principal.idPrincipalPk = idPrincipal
        }

        val tagPrincipalDao = TagPrincipalDao(con, lang)
    
        tagPrincipalDao.removeAllFromPrincipal(idPrincipal)
        
        principal.tagPrincipal?.let { list ->
            for (tag in list) {
                tagPrincipalDao.insert(tag.idTagPk, idPrincipal)
            }
        }

        return idPrincipal
    }

    fun remove(
        idPrincipalPk: Long?,
        token: String?) {
        //TODO: review generated method
        loginS.allowAccess(token)
        val principalDao = PrincipalDao(con, lang)

        if (idPrincipalPk == null) {
            throw HttpException(lang.cannotBeNull("id"), Response.Status.NOT_ACCEPTABLE)
        }

            
        principalDao.softDelete(idPrincipalPk)
    }

}

package br.com.martinlabs.usecase.crud.process

import br.com.martinlabs.usecase.model.GrupoDoPrincipal
import br.com.martinlabs.usecase.crud.response.GrupoDoPrincipalResp
import br.com.martinlabs.usecase.dao.GrupoDoPrincipalDao
import com.google.common.base.Strings
import com.simpli.model.LanguageHolder
import com.simpli.model.PagedResp
import com.simpli.model.RespException
import java.sql.Connection

/**
 * GrupoDoPrincipal business logic
 * @author martinlabs CRUD generator
 */
class GrupoDoPrincipalProcess(private val con: Connection, private val lang: LanguageHolder, private val clientVersion: String) {

    private val loginS = LoginServices(con, lang, clientVersion)

    fun list(
        token: String?, 
        queryP: String?,
        page: Int?,
        limit: Int?,
        orderRequest: String?,
        asc: Boolean?): PagedResp<GrupoDoPrincipal> {
        //TODO: review generated method
        var query = queryP
        
        if (query != null) {
            query = query.replace("[.,:\\-\\/]".toRegex(), "")
        }

        loginS.allowAccess(token)

        val dao = GrupoDoPrincipalDao(con, lang)

        val listGrupoDoPrincipal = dao.list(query, page, limit, orderRequest, asc)

        val resp = PagedResp(listGrupoDoPrincipal)

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

    fun getOne(idGrupoDoPrincipalPk: Long?, token: String?): GrupoDoPrincipalResp {
        //TODO: review generated method
        loginS.allowAccess(token)

        val grupoDoPrincipalDao = GrupoDoPrincipalDao(con, lang)
        val resp = GrupoDoPrincipalResp()

        if (idGrupoDoPrincipalPk != null && idGrupoDoPrincipalPk > 0) {
            val grupoDoPrincipal = grupoDoPrincipalDao.getOne(idGrupoDoPrincipalPk)
            resp.grupoDoPrincipal = grupoDoPrincipal
        }

        return resp
    }

    fun persist(grupoDoPrincipal: GrupoDoPrincipal, token: String?): Long {
        //TODO: review generated method
        loginS.allowAccess(token)

        val dao = GrupoDoPrincipalDao(con, lang)

        val idGrupoDoPrincipal: Long
        if (grupoDoPrincipal.idGrupoDoPrincipalPk > 0) {
            grupoDoPrincipal.validate(true, lang)
            idGrupoDoPrincipal = grupoDoPrincipal.idGrupoDoPrincipalPk
            
            dao.updateGrupoDoPrincipal(grupoDoPrincipal)
        } else {
            grupoDoPrincipal.validate(false, lang)
            idGrupoDoPrincipal = dao.insert(grupoDoPrincipal)
            grupoDoPrincipal.idGrupoDoPrincipalPk = idGrupoDoPrincipal
        }

        return idGrupoDoPrincipal
    }

}

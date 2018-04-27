package br.com.martinlabs.usecase.crud.process

import br.com.martinlabs.usecase.model.ConectorPrincipal
import br.com.martinlabs.usecase.crud.response.ConectorPrincipalResp
import br.com.martinlabs.usecase.dao.ConectorPrincipalDao
import br.com.martinlabs.usecase.dao.ConectadoDao
import br.com.martinlabs.usecase.dao.PrincipalDao
import com.google.common.base.Strings
import com.simpli.model.LanguageHolder
import com.simpli.model.PagedResp
import com.simpli.model.RespException
import java.sql.Connection

/**
 * ConectorPrincipal business logic
 * @author martinlabs CRUD generator
 */
class ConectorPrincipalProcess(private val con: Connection, private val lang: LanguageHolder, private val clientVersion: String) {

    private val loginS = LoginServices(con, lang, clientVersion)

    fun list(
        token: String?, 
        queryP: String?,
        page: Int?,
        limit: Int?,
        orderRequest: String?,
        asc: Boolean?): PagedResp<ConectorPrincipal> {
        //TODO: review generated method
        var query = queryP
        
        if (query != null) {
            query = query.replace("[.,:\\-\\/]".toRegex(), "")
        }

        loginS.allowAccess(token)

        val dao = ConectorPrincipalDao(con, lang)

        val listConectorPrincipal = dao.list(query, page, limit, orderRequest, asc)

        val resp = PagedResp(listConectorPrincipal)

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

    fun getOne(idPrincipalFk: Long?, idConectadoFk: Long?, token: String?): ConectorPrincipalResp {
        //TODO: review generated method
        loginS.allowAccess(token)

        val conectorPrincipalDao = ConectorPrincipalDao(con, lang)
        val conectadoDao = ConectadoDao(con, lang)
        val principalDao = PrincipalDao(con, lang)
        val resp = ConectorPrincipalResp()

        if (idPrincipalFk != null && idPrincipalFk > 0 && idConectadoFk != null && idConectadoFk > 0) {
            val conectorPrincipal = conectorPrincipalDao.getOne(idPrincipalFk, idConectadoFk)
            resp.conectorPrincipal = conectorPrincipal
        }
        resp.allConectado = conectadoDao.list()

        resp.allPrincipal = principalDao.list()


        return resp
    }

    fun persist(conectorPrincipal: ConectorPrincipal, token: String?): Long {
        //TODO: review generated method
        loginS.allowAccess(token)

        val dao = ConectorPrincipalDao(con, lang)

        val idConectorPrincipal = conectorPrincipal.idPrincipalFk;
        val exist = dao.existConectorPrincipal(conectorPrincipal.idPrincipalFk, conectorPrincipal.idConectadoFk);
        if (exist) {
            conectorPrincipal.validate(true, lang)
            dao.updateConectorPrincipal(conectorPrincipal)
        } else {
            conectorPrincipal.validate(false, lang)
            dao.insert(conectorPrincipal)
        }

        return idConectorPrincipal
    }

}

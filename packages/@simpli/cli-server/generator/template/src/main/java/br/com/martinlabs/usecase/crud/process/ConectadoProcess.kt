package br.com.martinlabs.usecase.crud.process

import br.com.martinlabs.usecase.model.Conectado
import br.com.martinlabs.usecase.crud.response.ConectadoResp
import br.com.martinlabs.usecase.dao.ConectadoDao
import com.google.common.base.Strings
import com.simpli.model.LanguageHolder
import com.simpli.model.PagedResp
import com.simpli.model.RespException
import java.sql.Connection

/**
 * Conectado business logic
 * @author martinlabs CRUD generator
 */
class ConectadoProcess(private val con: Connection, private val lang: LanguageHolder, private val clientVersion: String) {

    private val loginS = LoginServices(con, lang, clientVersion)

    fun list(
        token: String?, 
        queryP: String?,
        page: Int?,
        limit: Int?,
        orderRequest: String?,
        asc: Boolean?): PagedResp<Conectado> {
        //TODO: review generated method
        var query = queryP
        
        if (query != null) {
            query = query.replace("[.,:\\-\\/]".toRegex(), "")
        }

        loginS.allowAccess(token)

        val dao = ConectadoDao(con, lang)

        val listConectado = dao.list(query, page, limit, orderRequest, asc)

        val resp = PagedResp(listConectado)

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

    fun getOne(idConectadoPk: Long?, token: String?): ConectadoResp {
        //TODO: review generated method
        loginS.allowAccess(token)

        val conectadoDao = ConectadoDao(con, lang)
        val resp = ConectadoResp()

        if (idConectadoPk != null && idConectadoPk > 0) {
            val conectado = conectadoDao.getOne(idConectadoPk)
            resp.conectado = conectado
        }

        return resp
    }

    fun persist(conectado: Conectado, token: String?): Long {
        //TODO: review generated method
        loginS.allowAccess(token)

        val dao = ConectadoDao(con, lang)

        val idConectado: Long
        if (conectado.idConectadoPk > 0) {
            conectado.validate(true, lang)
            idConectado = conectado.idConectadoPk
            
            dao.updateConectado(conectado)
        } else {
            conectado.validate(false, lang)
            idConectado = dao.insert(conectado)
            conectado.idConectadoPk = idConectado
        }

        return idConectado
    }

}

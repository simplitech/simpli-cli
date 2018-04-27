package br.com.martinlabs.usecase.crud.process

import br.com.martinlabs.usecase.model.ExtensaoDoPrincipal
import br.com.martinlabs.usecase.crud.response.ExtensaoDoPrincipalResp
import br.com.martinlabs.usecase.dao.ExtensaoDoPrincipalDao
import br.com.martinlabs.usecase.dao.PrincipalDao
import com.google.common.base.Strings
import com.simpli.model.LanguageHolder
import com.simpli.model.PagedResp
import com.simpli.model.RespException
import java.sql.Connection

/**
 * ExtensaoDoPrincipal business logic
 * @author martinlabs CRUD generator
 */
class ExtensaoDoPrincipalProcess(private val con: Connection, private val lang: LanguageHolder, private val clientVersion: String) {

    private val loginS = LoginServices(con, lang, clientVersion)

    fun list(
        token: String?, 
        queryP: String?,
        page: Int?,
        limit: Int?,
        orderRequest: String?,
        asc: Boolean?): PagedResp<ExtensaoDoPrincipal> {
        //TODO: review generated method
        var query = queryP
        
        if (query != null) {
            query = query.replace("[.,:\\-\\/]".toRegex(), "")
        }

        loginS.allowAccess(token)

        val dao = ExtensaoDoPrincipalDao(con, lang)

        val listExtensaoDoPrincipal = dao.list(query, page, limit, orderRequest, asc)

        val resp = PagedResp(listExtensaoDoPrincipal)

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

    fun getOne(idPrincipalFk: Long?, token: String?): ExtensaoDoPrincipalResp {
        //TODO: review generated method
        loginS.allowAccess(token)

        val extensaoDoPrincipalDao = ExtensaoDoPrincipalDao(con, lang)
        val principalDao = PrincipalDao(con, lang)
        val resp = ExtensaoDoPrincipalResp()

        if (idPrincipalFk != null && idPrincipalFk > 0) {
            val extensaoDoPrincipal = extensaoDoPrincipalDao.getOne(idPrincipalFk)
            resp.extensaoDoPrincipal = extensaoDoPrincipal
        }
        resp.allPrincipal = principalDao.list()


        return resp
    }

    fun persist(extensaoDoPrincipal: ExtensaoDoPrincipal, token: String?): Long {
        //TODO: review generated method
        loginS.allowAccess(token)

        val dao = ExtensaoDoPrincipalDao(con, lang)

        val idExtensaoDoPrincipal = extensaoDoPrincipal.idPrincipalFk;
        val exist = dao.existExtensaoDoPrincipal(extensaoDoPrincipal.idPrincipalFk);
        if (exist) {
            extensaoDoPrincipal.validate(true, lang)
            dao.updateExtensaoDoPrincipal(extensaoDoPrincipal)
        } else {
            extensaoDoPrincipal.validate(false, lang)
            dao.insert(extensaoDoPrincipal)
        }

        return idExtensaoDoPrincipal
    }

}

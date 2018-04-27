package br.com.martinlabs.usecase.crud.process

import br.com.martinlabs.usecase.model.Endereco
import br.com.martinlabs.usecase.crud.response.EnderecoResp
import br.com.martinlabs.usecase.dao.EnderecoDao
import com.google.common.base.Strings
import com.simpli.model.LanguageHolder
import com.simpli.model.PagedResp
import com.simpli.model.RespException
import java.sql.Connection

/**
 * Endereco business logic
 * @author martinlabs CRUD generator
 */
class EnderecoProcess(private val con: Connection, private val lang: LanguageHolder, private val clientVersion: String) {

    private val loginS = LoginServices(con, lang, clientVersion)

    fun list(
        token: String?, 
        queryP: String?,
        page: Int?,
        limit: Int?,
        orderRequest: String?,
        asc: Boolean?): PagedResp<Endereco> {
        //TODO: review generated method
        var query = queryP
        
        if (query != null) {
            query = query.replace("[.,:\\-\\/]".toRegex(), "")
        }

        loginS.allowAccess(token)

        val dao = EnderecoDao(con, lang)

        val listEndereco = dao.list(query, page, limit, orderRequest, asc)

        val resp = PagedResp(listEndereco)

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

    fun getOne(idEnderecoPk: Long?, token: String?): EnderecoResp {
        //TODO: review generated method
        loginS.allowAccess(token)

        val enderecoDao = EnderecoDao(con, lang)
        val resp = EnderecoResp()

        if (idEnderecoPk != null && idEnderecoPk > 0) {
            val endereco = enderecoDao.getOne(idEnderecoPk)
            resp.endereco = endereco
        }

        return resp
    }

    fun persist(endereco: Endereco, token: String?): Long {
        //TODO: review generated method
        loginS.allowAccess(token)

        val dao = EnderecoDao(con, lang)

        val idEndereco: Long
        if (endereco.idEnderecoPk > 0) {
            endereco.validate(true, lang)
            idEndereco = endereco.idEnderecoPk
            
            dao.updateEndereco(endereco)
        } else {
            endereco.validate(false, lang)
            idEndereco = dao.insert(endereco)
            endereco.idEnderecoPk = idEndereco
        }

        return idEndereco
    }

}

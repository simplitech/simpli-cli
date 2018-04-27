package br.com.martinlabs.usecase.crud.process

import br.com.martinlabs.usecase.model.ItemDoPrincipal
import br.com.martinlabs.usecase.crud.response.ItemDoPrincipalResp
import br.com.martinlabs.usecase.dao.ItemDoPrincipalDao
import br.com.martinlabs.usecase.dao.PrincipalDao
import com.google.common.base.Strings
import com.simpli.model.LanguageHolder
import com.simpli.model.PagedResp
import com.simpli.model.RespException
import java.sql.Connection

/**
 * ItemDoPrincipal business logic
 * @author martinlabs CRUD generator
 */
class ItemDoPrincipalProcess(private val con: Connection, private val lang: LanguageHolder, private val clientVersion: String) {

    private val loginS = LoginServices(con, lang, clientVersion)

    fun list(
        token: String?, 
        queryP: String?,
        page: Int?,
        limit: Int?,
        orderRequest: String?,
        asc: Boolean?): PagedResp<ItemDoPrincipal> {
        //TODO: review generated method
        var query = queryP
        
        if (query != null) {
            query = query.replace("[.,:\\-\\/]".toRegex(), "")
        }

        loginS.allowAccess(token)

        val dao = ItemDoPrincipalDao(con, lang)

        val listItemDoPrincipal = dao.list(query, page, limit, orderRequest, asc)

        val resp = PagedResp(listItemDoPrincipal)

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

    fun getOne(idItemDoPrincipalPk: Long?, token: String?): ItemDoPrincipalResp {
        //TODO: review generated method
        loginS.allowAccess(token)

        val itemDoPrincipalDao = ItemDoPrincipalDao(con, lang)
        val principalDao = PrincipalDao(con, lang)
        val resp = ItemDoPrincipalResp()

        if (idItemDoPrincipalPk != null && idItemDoPrincipalPk > 0) {
            val itemDoPrincipal = itemDoPrincipalDao.getOne(idItemDoPrincipalPk)
            resp.itemDoPrincipal = itemDoPrincipal
        }
        resp.allPrincipal = principalDao.list()


        return resp
    }

    fun persist(itemDoPrincipal: ItemDoPrincipal, token: String?): Long {
        //TODO: review generated method
        loginS.allowAccess(token)

        val dao = ItemDoPrincipalDao(con, lang)

        val idItemDoPrincipal: Long
        if (itemDoPrincipal.idItemDoPrincipalPk > 0) {
            itemDoPrincipal.validate(true, lang)
            idItemDoPrincipal = itemDoPrincipal.idItemDoPrincipalPk
            
            dao.updateItemDoPrincipal(itemDoPrincipal)
        } else {
            itemDoPrincipal.validate(false, lang)
            idItemDoPrincipal = dao.insert(itemDoPrincipal)
            itemDoPrincipal.idItemDoPrincipalPk = idItemDoPrincipal
        }

        return idItemDoPrincipal
    }

}

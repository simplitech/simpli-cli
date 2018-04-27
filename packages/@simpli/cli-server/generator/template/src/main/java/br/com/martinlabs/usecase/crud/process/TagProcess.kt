package br.com.martinlabs.usecase.crud.process

import br.com.martinlabs.usecase.model.Tag
import br.com.martinlabs.usecase.model.Principal
import br.com.martinlabs.usecase.crud.response.TagResp
import br.com.martinlabs.usecase.dao.TagDao
import br.com.martinlabs.usecase.dao.TagPrincipalDao
import br.com.martinlabs.usecase.dao.PrincipalDao
import com.google.common.base.Strings
import com.simpli.model.LanguageHolder
import com.simpli.model.PagedResp
import com.simpli.model.RespException
import java.sql.Connection

/**
 * Tag business logic
 * @author martinlabs CRUD generator
 */
class TagProcess(private val con: Connection, private val lang: LanguageHolder, private val clientVersion: String) {

    private val loginS = LoginServices(con, lang, clientVersion)

    fun list(
        token: String?, 
        queryP: String?,
        page: Int?,
        limit: Int?,
        orderRequest: String?,
        asc: Boolean?): PagedResp<Tag> {
        //TODO: review generated method
        var query = queryP
        
        if (query != null) {
            query = query.replace("[.,:\\-\\/]".toRegex(), "")
        }

        loginS.allowAccess(token)

        val dao = TagDao(con, lang)

        val listTag = dao.list(query, page, limit, orderRequest, asc)

        val resp = PagedResp(listTag)

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

    fun getOne(idTagPk: Long?, token: String?): TagResp {
        //TODO: review generated method
        loginS.allowAccess(token)

        val tagDao = TagDao(con, lang)
        val tagPrincipalDao = TagPrincipalDao(con, lang)
        val principalDao = PrincipalDao(con, lang)
        val resp = TagResp()

        if (idTagPk != null && idTagPk > 0) {
            val tag = tagDao.getOne(idTagPk)
            if (tag != null) {
                tag.tagPrincipal = tagPrincipalDao.listPrincipalOfTag(idTagPk)
            }

            resp.tag = tag
        }
        resp.allPrincipal = principalDao.list()


        return resp
    }

    fun persist(tag: Tag, token: String?): Long {
        //TODO: review generated method
        loginS.allowAccess(token)

        val dao = TagDao(con, lang)

        val idTag: Long
        if (tag.idTagPk > 0) {
            tag.validate(true, lang)
            idTag = tag.idTagPk
            
            dao.updateTag(tag)
        } else {
            tag.validate(false, lang)
            idTag = dao.insert(tag)
            tag.idTagPk = idTag
        }

        val tagPrincipalDao = TagPrincipalDao(con, lang)
    
        tagPrincipalDao.removeAllFromTag(idTag)
        
        tag.tagPrincipal?.let { list ->
            for (principal in list) {
                tagPrincipalDao.insert(idTag, principal.idPrincipalPk)
            }
        }

        return idTag
    }

}

package br.com.martinlabs.usecase.dao

import br.com.martinlabs.usecase.model.Tag
import br.com.martinlabs.usecase.model.Principal
import com.simpli.model.LanguageHolder
import com.simpli.sql.Dao
import java.sql.Connection


/**
 * Responsible for TagPrincipal database operations
 * @author martinlabs CRUD generator
 */
class TagPrincipalDao(con: Connection, lang: LanguageHolder) : Dao(con, lang) {
    
    fun insert(idTagFk: Long, idPrincipalFk: Long): Int {
        //TODO: review generated method
        return update("""
            INSERT INTO tag_principal ( 
            idTagFk,
            idPrincipalFk
            ) VALUES (
            ?,?
            )
            """,
            idTagFk,
            idPrincipalFk).affectedRows
    }

    fun removeAllFromTag(idTagFk: Long): Int {
        //TODO: review generated method
        return update("DELETE FROM tag_principal WHERE idTagFk = ? ",
            idTagFk).affectedRows
    }

    fun removeAllFromPrincipal(idPrincipalFk: Long): Int {
        //TODO: review generated method
        return update("DELETE FROM tag_principal WHERE idPrincipalFk = ? ",
            idPrincipalFk).affectedRows
    }

    fun listTagOfPrincipal(idPrincipalFk: Long): MutableList<Tag> {
        //TODO: review generated method
        return selectList("""
            SELECT *
            FROM tag
            INNER JOIN tag_principal ON tag.idTagPk = tag_principal.idTagFk
            WHERE tag_principal.idPrincipalFk = ?
            """, 
            { rs -> Tag.buildAll(rs) }, 
            idPrincipalFk)
    } 

    fun listPrincipalOfTag(idTagFk: Long): MutableList<Principal> {
        //TODO: review generated method
        return selectList("""
            SELECT *
            FROM principal
            INNER JOIN tag_principal ON principal.idPrincipalPk = tag_principal.idPrincipalFk
            WHERE tag_principal.idTagFk = ?
            AND principal.ativo = 1
            """, 
            { rs -> Principal.buildAll(rs) }, 
            idTagFk)
    }

}

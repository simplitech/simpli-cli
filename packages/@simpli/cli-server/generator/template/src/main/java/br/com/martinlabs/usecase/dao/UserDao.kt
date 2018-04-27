package br.com.martinlabs.usecase.dao

import br.com.martinlabs.usecase.model.User
import com.google.common.base.Strings
import java.sql.Connection
import java.util.ArrayList
import java.util.HashMap
import com.simpli.model.LanguageHolder
import com.simpli.sql.Dao

/**
 * Responsible for User database operations
 * @author martinlabs CRUD generator
 */
class UserDao(con: Connection, lang: LanguageHolder) : Dao(con, lang) {
    
    fun getOne(idUserPk: Long): User? {
        //TODO: review generated method
        return selectOne("""
            SELECT *
            FROM user
            WHERE idUserPk = ?
            """,
            { rs -> User.buildAll(rs) }, 
            idUserPk)
    }

    fun list(
        query: String?,
        page: Int?,
        limit: Int?,
        orderRequest: String?,
        asc: Boolean?): MutableList<User> {
        //TODO: review generated method

        val orderRequestAndColumn = HashMap<String, String>()


        orderRequestAndColumn.put("idUserPk", "user.idUserPk")
        orderRequestAndColumn.put("email", "user.email")
        val orderColumn = orderRequestAndColumn[orderRequest]

        val params = ArrayList<Any>()
        var where = ""

        if (!Strings.isNullOrEmpty(query)) {
            where += ("""
                WHERE LOWER(CONCAT(
                IFNULL(user.idUserPk, ''),
                IFNULL(user.email, '')
                )) LIKE LOWER(?)
                """)
            params.add("%$query%")
        }

        var limitQuery = ""
        if (page != null && limit != null) {
            limitQuery = "LIMIT ?, ? "
            params.add(page * limit)
            params.add(limit)
        }

        return selectList("""
            SELECT *
            FROM user
            $where
            ${(if (orderColumn != null && asc != null) "ORDER BY " + orderColumn + " " + (if (asc) "ASC " else "DESC ") else "")}
            $limitQuery
            """,
            { rs -> User.buildAll(rs) }, 
            *params.toTypedArray())
    }
    
    fun count(): Int? {
        //TODO: review generated method
        return selectFirstInt("""
            SELECT COUNT(idUserPk)
            FROM user
            """)
    }
    
    fun count(search: String?): Int? {
        //TODO: review generated method
        return selectFirstInt("""
            SELECT COUNT(idUserPk)
            FROM user
            WHERE LOWER(CONCAT(
            IFNULL(user.idUserPk, ''),
            IFNULL(user.email, '')
            )) LIKE LOWER(?)
            """, 
            "%$search%")
    }
    
    fun updateUser(user: User): Int {
        //TODO: review generated method
        return update("""
            UPDATE user SET
            email = ?,
            senha = IF(? IS NOT NULL, SHA2(?, 256), senha)
            WHERE idUserPk = ?
            """,
            user.email, 
            user.senha, user.senha,
            user.idUserPk).affectedRows
    }
    
    fun insert(user: User): Long {
        //TODO: review generated method
        return update("""
            INSERT INTO user (
            email,
            senha
            ) VALUES (
            ?,SHA2(?, 256)
            )
            """,
            user.email,
            user.senha).key
    }


}

package br.com.martinlabs.usecase.dao

import br.com.martinlabs.usecase.model.User
import com.simpli.model.LanguageHolder
import com.simpli.sql.Dao
import java.sql.Connection

/**
 * Responsible for database login operations
 * @author martinlabs CRUD generator
 */
class LoginServiceDao(con: Connection, lang: LanguageHolder) : Dao(con, lang) {

    fun getIdOfUser(account: String?, password: String?): Long {
        return nullToZero(selectFirstLong("""
                SELECT idUserPk 
                FROM user 
                WHERE email = ? 
                AND senha = sha2(?, 256) 
                """,
                account, password))
    }

    fun getUser(idUserPk: Long): User? {
        //TODO: review generated method
        return selectOne("""
            SELECT *
            FROM user
            WHERE idUserPk = ?
            """,
                { rs -> User.buildAll(rs) },
                idUserPk)
    }
}

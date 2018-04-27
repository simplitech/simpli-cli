package br.com.martinlabs.usecase.dao

import br.com.martinlabs.usecase.model.Endereco
import com.google.common.base.Strings
import java.sql.Connection
import java.util.ArrayList
import java.util.HashMap
import com.simpli.model.LanguageHolder
import com.simpli.sql.Dao

/**
 * Responsible for Endereco database operations
 * @author martinlabs CRUD generator
 */
class EnderecoDao(con: Connection, lang: LanguageHolder) : Dao(con, lang) {
    
    fun getOne(idEnderecoPk: Long): Endereco? {
        //TODO: review generated method
        return selectOne("""
            SELECT *
            FROM endereco
            WHERE idEnderecoPk = ?
            """,
            { rs -> Endereco.buildAll(rs) }, 
            idEnderecoPk)
    }

    fun list(
        query: String?,
        page: Int?,
        limit: Int?,
        orderRequest: String?,
        asc: Boolean?): MutableList<Endereco> {
        //TODO: review generated method

        val orderRequestAndColumn = HashMap<String, String>()


        orderRequestAndColumn.put("idEnderecoPk", "endereco.idEnderecoPk")
        orderRequestAndColumn.put("cep", "endereco.cep")
        orderRequestAndColumn.put("zipcode", "endereco.zipcode")
        orderRequestAndColumn.put("rua", "endereco.rua")
        orderRequestAndColumn.put("nro", "endereco.nro")
        orderRequestAndColumn.put("cidade", "endereco.cidade")
        orderRequestAndColumn.put("uf", "endereco.uf")
        orderRequestAndColumn.put("latitude", "endereco.latitude")
        orderRequestAndColumn.put("longitude", "endereco.longitude")
        val orderColumn = orderRequestAndColumn[orderRequest]

        val params = ArrayList<Any>()
        var where = ""

        if (!Strings.isNullOrEmpty(query)) {
            where += ("""
                WHERE LOWER(CONCAT(
                IFNULL(endereco.idEnderecoPk, ''),
                IFNULL(endereco.cep, ''),
                IFNULL(endereco.zipcode, ''),
                IFNULL(endereco.rua, ''),
                IFNULL(endereco.nro, ''),
                IFNULL(endereco.cidade, ''),
                IFNULL(endereco.uf, ''),
                IFNULL(endereco.latitude, ''),
                IFNULL(endereco.longitude, '')
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
            FROM endereco
            $where
            ${(if (orderColumn != null && asc != null) "ORDER BY " + orderColumn + " " + (if (asc) "ASC " else "DESC ") else "")}
            $limitQuery
            """,
            { rs -> Endereco.buildAll(rs) }, 
            *params.toTypedArray())
    }
    
    fun count(): Int? {
        //TODO: review generated method
        return selectFirstInt("""
            SELECT COUNT(idEnderecoPk)
            FROM endereco
            """)
    }
    
    fun count(search: String?): Int? {
        //TODO: review generated method
        return selectFirstInt("""
            SELECT COUNT(idEnderecoPk)
            FROM endereco
            WHERE LOWER(CONCAT(
            IFNULL(endereco.idEnderecoPk, ''),
            IFNULL(endereco.cep, ''),
            IFNULL(endereco.zipcode, ''),
            IFNULL(endereco.rua, ''),
            IFNULL(endereco.nro, ''),
            IFNULL(endereco.cidade, ''),
            IFNULL(endereco.uf, ''),
            IFNULL(endereco.latitude, ''),
            IFNULL(endereco.longitude, '')
            )) LIKE LOWER(?)
            """, 
            "%$search%")
    }
    
    fun updateEndereco(endereco: Endereco): Int {
        //TODO: review generated method
        return update("""
            UPDATE endereco SET
            cep = ?,
            zipcode = ?,
            rua = ?,
            nro = ?,
            cidade = ?,
            uf = ?,
            latitude = ?,
            longitude = ?
            WHERE idEnderecoPk = ?
            """,
            endereco.cep, 
            endereco.zipcode, 
            endereco.rua, 
            endereco.nro, 
            endereco.cidade, 
            endereco.uf, 
            endereco.latitude, 
            endereco.longitude, 
            endereco.idEnderecoPk).affectedRows
    }
    
    fun insert(endereco: Endereco): Long {
        //TODO: review generated method
        return update("""
            INSERT INTO endereco (
            cep,
            zipcode,
            rua,
            nro,
            cidade,
            uf,
            latitude,
            longitude
            ) VALUES (
            ?,?,?,?,?,?,?,?
            )
            """,
            endereco.cep,
            endereco.zipcode,
            endereco.rua,
            endereco.nro,
            endereco.cidade,
            endereco.uf,
            endereco.latitude,
            endereco.longitude).key
    }


}

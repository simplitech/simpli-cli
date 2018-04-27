package br.com.martinlabs.usecase.crud

import com.simpli.model.PagedResp
import br.com.martinlabs.usecase.RouterWrapper
import javax.ws.rs.GET
import javax.ws.rs.POST
import javax.ws.rs.DELETE
import javax.ws.rs.Path
import javax.ws.rs.PathParam
import javax.ws.rs.Produces
import javax.ws.rs.QueryParam
import javax.ws.rs.core.MediaType
import javax.ws.rs.HeaderParam
import io.swagger.annotations.Api
import io.swagger.annotations.ApiOperation
import io.swagger.annotations.ApiParam

import br.com.martinlabs.usecase.crud.process.LoginServices
import br.com.martinlabs.usecase.crud.process.LoginServices.LoginHolder
import br.com.martinlabs.usecase.crud.response.LoginResp
import br.com.martinlabs.usecase.crud.process.ConectadoProcess
import br.com.martinlabs.usecase.crud.response.ConectadoResp
import br.com.martinlabs.usecase.model.Conectado
import br.com.martinlabs.usecase.crud.process.ConectorPrincipalProcess
import br.com.martinlabs.usecase.crud.response.ConectorPrincipalResp
import br.com.martinlabs.usecase.model.ConectorPrincipal
import br.com.martinlabs.usecase.crud.process.EnderecoProcess
import br.com.martinlabs.usecase.crud.response.EnderecoResp
import br.com.martinlabs.usecase.model.Endereco
import br.com.martinlabs.usecase.crud.process.ExtensaoDoPrincipalProcess
import br.com.martinlabs.usecase.crud.response.ExtensaoDoPrincipalResp
import br.com.martinlabs.usecase.model.ExtensaoDoPrincipal
import br.com.martinlabs.usecase.crud.process.GrupoDoPrincipalProcess
import br.com.martinlabs.usecase.crud.response.GrupoDoPrincipalResp
import br.com.martinlabs.usecase.model.GrupoDoPrincipal
import br.com.martinlabs.usecase.crud.process.ItemDoPrincipalProcess
import br.com.martinlabs.usecase.crud.response.ItemDoPrincipalResp
import br.com.martinlabs.usecase.model.ItemDoPrincipal
import br.com.martinlabs.usecase.crud.process.PrincipalProcess
import br.com.martinlabs.usecase.crud.response.PrincipalResp
import br.com.martinlabs.usecase.model.Principal
import br.com.martinlabs.usecase.crud.process.TagProcess
import br.com.martinlabs.usecase.crud.response.TagResp
import br.com.martinlabs.usecase.model.Tag
import br.com.martinlabs.usecase.crud.process.UserProcess
import br.com.martinlabs.usecase.crud.response.UserResp
import br.com.martinlabs.usecase.model.User

/**
 * Routes of Crud module
 * @author martinlabs CRUD generator
 */
@Path("/Crud")
@Api(tags = arrayOf("Crud"))
@Produces(MediaType.APPLICATION_JSON)
class Router : RouterWrapper() {

    @GET
    @Path("/Auth")
    @ApiOperation(value = "Get user authentication")
    fun auth(
            @HeaderParam("Accept-Language") @ApiParam(required = true, allowableValues = "en, pt")
            lang: String,
            @HeaderParam("X-Client-Version") @ApiParam(required = true, example = "w1.1.0")
            clientVersion: String,
            @HeaderParam("Authorization") @ApiParam(required = true, example = "Bearer mytokenhere")
            authorization: String): LoginResp {
        //TODO: review generated method
        return pipe.handle { con ->
            LoginServices(con, getLang(lang), clientVersion)
                    .auth(extractToken(authorization))
        }
    }

    @POST
    @Path("/SignIn")
    @ApiOperation(value = "Submit user authentication")
    fun signIn(
        @HeaderParam("Accept-Language") @ApiParam(required = true, allowableValues = "en, pt")
            lang: String,
        @HeaderParam("X-Client-Version") @ApiParam(required = true, example = "w1.1.0")
            clientVersion: String,

        @ApiParam(required = true)
            body: LoginHolder): LoginResp {
        //TODO: review generated method
        return pipe.handle { con ->
            LoginServices(con, getLang(lang), clientVersion)
                    .signIn(body.account, body.password)
        }
    }

    @GET
    @Path("/Conectado/{id}")
    @ApiOperation(value = "Gets Conectado of informed id")
    fun getConectado(
        @PathParam("id") @ApiParam(required = true)
            id: Long?,

        @HeaderParam("Accept-Language") @ApiParam(required = true, allowableValues = "en, pt")
            lang: String,
        @HeaderParam("X-Client-Version") @ApiParam(required = true, example = "w1.1.0")
            clientVersion: String,
        @HeaderParam("Authorization") @ApiParam(required = true, example = "Bearer mytokenhere")
            authorization: String): ConectadoResp {
        //TODO: review generated method
        return pipe.handle { con ->
            ConectadoProcess(con, getLang(lang), clientVersion).getOne(id, extractToken(authorization))
        }
    }

    @GET
    @Path("/Conectado")
    @ApiOperation(value = "List Conectado informations")
    fun listConectado(
        @HeaderParam("Accept-Language") @ApiParam(required = true, allowableValues = "en, pt")
            lang: String,
        @HeaderParam("X-Client-Version") @ApiParam(required = true, example = "w1.1.0")
            clientVersion: String,
        @HeaderParam("Authorization") @ApiParam(required = true, example = "Bearer mytokenhere")
            authorization: String,

        @QueryParam("query") @ApiParam(value = "Query of search")
            query: String?,
        @QueryParam("page") @ApiParam(value = "Page index, null to not paginate")
            page: Int?,
        @QueryParam("limit") @ApiParam(value = "Page size, null to not paginate")
            limit: Int?,
        @QueryParam("orderBy") @ApiParam(value = "Identifier for sorting, usually a property name", example = "idConectadoPk")
            orderRequest: String?,
        @QueryParam("ascending") @ApiParam(value = "True for ascending order", defaultValue = "false")
            asc: Boolean?): PagedResp<Conectado> {
        //TODO: review generated method
        return pipe.handle { con ->
            ConectadoProcess(con, getLang(lang), clientVersion)
                    .list(extractToken(authorization), query, page, limit, orderRequest, asc != null && asc)
        }
    }

    @POST
    @Path("/Conectado")
    @ApiOperation(value = "Persist a new or existing Conectado", notes = "1 - Informed Conectado have an ID editing the existing Conectado; 2 - Informed Conectado don't have an ID creating a new Conectado")
    fun persistConectado(
        @HeaderParam("Accept-Language") @ApiParam(required = true, allowableValues = "en, pt")
            lang: String,
        @HeaderParam("X-Client-Version") @ApiParam(required = true, example = "w1.1.0")
            clientVersion: String,
        @HeaderParam("Authorization") @ApiParam(required = true, example = "Bearer mytokenhere")
            authorization: String,

        @ApiParam(required = true)
            conectado: Conectado): Long {
        //TODO: review generated method
        return pipe.handle<Long> { con ->
            ConectadoProcess(con, getLang(lang), clientVersion)
                    .persist(conectado, extractToken(authorization))
        }
    }

    @GET
    @Path("/ConectorPrincipal/{idPrincipalFk}/{idConectadoFk}")
    @ApiOperation(value = "Gets ConectorPrincipal of informed id")
    fun getConectorPrincipal(
        @PathParam("idPrincipalFk") @ApiParam(required = true)
            idPrincipalFk: Long,
        @PathParam("idConectadoFk") @ApiParam(required = true)
            idConectadoFk: Long,

        @HeaderParam("Accept-Language") @ApiParam(required = true, allowableValues = "en, pt")
            lang: String,
        @HeaderParam("X-Client-Version") @ApiParam(required = true, example = "w1.1.0")
            clientVersion: String,
        @HeaderParam("Authorization") @ApiParam(required = true, example = "Bearer mytokenhere")
            authorization: String): ConectorPrincipalResp {
        //TODO: review generated method
        return pipe.handle { con ->
            ConectorPrincipalProcess(con, getLang(lang), clientVersion).getOne(idPrincipalFk, idConectadoFk, extractToken(authorization))
        }
    }

    @GET
    @Path("/ConectorPrincipal")
    @ApiOperation(value = "List ConectorPrincipal informations")
    fun listConectorPrincipal(
        @HeaderParam("Accept-Language") @ApiParam(required = true, allowableValues = "en, pt")
            lang: String,
        @HeaderParam("X-Client-Version") @ApiParam(required = true, example = "w1.1.0")
            clientVersion: String,
        @HeaderParam("Authorization") @ApiParam(required = true, example = "Bearer mytokenhere")
            authorization: String,

        @QueryParam("query") @ApiParam(value = "Query of search")
            query: String?,
        @QueryParam("page") @ApiParam(value = "Page index, null to not paginate")
            page: Int?,
        @QueryParam("limit") @ApiParam(value = "Page size, null to not paginate")
            limit: Int?,
        @QueryParam("orderBy") @ApiParam(value = "Identifier for sorting, usually a property name", example = "idConectadoFk")
            orderRequest: String?,
        @QueryParam("ascending") @ApiParam(value = "True for ascending order", defaultValue = "false")
            asc: Boolean?): PagedResp<ConectorPrincipal> {
        //TODO: review generated method
        return pipe.handle { con ->
            ConectorPrincipalProcess(con, getLang(lang), clientVersion)
                    .list(extractToken(authorization), query, page, limit, orderRequest, asc != null && asc)
        }
    }

    @POST
    @Path("/ConectorPrincipal")
    @ApiOperation(value = "Persist a new or existing ConectorPrincipal", notes = "1 - Informed ConectorPrincipal have an ID editing the existing ConectorPrincipal; 2 - Informed ConectorPrincipal don't have an ID creating a new ConectorPrincipal")
    fun persistConectorPrincipal(
        @HeaderParam("Accept-Language") @ApiParam(required = true, allowableValues = "en, pt")
            lang: String,
        @HeaderParam("X-Client-Version") @ApiParam(required = true, example = "w1.1.0")
            clientVersion: String,
        @HeaderParam("Authorization") @ApiParam(required = true, example = "Bearer mytokenhere")
            authorization: String,

        @ApiParam(required = true)
            conectorPrincipal: ConectorPrincipal): Long {
        //TODO: review generated method
        return pipe.handle<Long> { con ->
            ConectorPrincipalProcess(con, getLang(lang), clientVersion)
                    .persist(conectorPrincipal, extractToken(authorization))
        }
    }

    @GET
    @Path("/Endereco/{id}")
    @ApiOperation(value = "Gets Endereco of informed id")
    fun getEndereco(
        @PathParam("id") @ApiParam(required = true)
            id: Long?,

        @HeaderParam("Accept-Language") @ApiParam(required = true, allowableValues = "en, pt")
            lang: String,
        @HeaderParam("X-Client-Version") @ApiParam(required = true, example = "w1.1.0")
            clientVersion: String,
        @HeaderParam("Authorization") @ApiParam(required = true, example = "Bearer mytokenhere")
            authorization: String): EnderecoResp {
        //TODO: review generated method
        return pipe.handle { con ->
            EnderecoProcess(con, getLang(lang), clientVersion).getOne(id, extractToken(authorization))
        }
    }

    @GET
    @Path("/Endereco")
    @ApiOperation(value = "List Endereco informations")
    fun listEndereco(
        @HeaderParam("Accept-Language") @ApiParam(required = true, allowableValues = "en, pt")
            lang: String,
        @HeaderParam("X-Client-Version") @ApiParam(required = true, example = "w1.1.0")
            clientVersion: String,
        @HeaderParam("Authorization") @ApiParam(required = true, example = "Bearer mytokenhere")
            authorization: String,

        @QueryParam("query") @ApiParam(value = "Query of search")
            query: String?,
        @QueryParam("page") @ApiParam(value = "Page index, null to not paginate")
            page: Int?,
        @QueryParam("limit") @ApiParam(value = "Page size, null to not paginate")
            limit: Int?,
        @QueryParam("orderBy") @ApiParam(value = "Identifier for sorting, usually a property name", example = "idEnderecoPk")
            orderRequest: String?,
        @QueryParam("ascending") @ApiParam(value = "True for ascending order", defaultValue = "false")
            asc: Boolean?): PagedResp<Endereco> {
        //TODO: review generated method
        return pipe.handle { con ->
            EnderecoProcess(con, getLang(lang), clientVersion)
                    .list(extractToken(authorization), query, page, limit, orderRequest, asc != null && asc)
        }
    }

    @POST
    @Path("/Endereco")
    @ApiOperation(value = "Persist a new or existing Endereco", notes = "1 - Informed Endereco have an ID editing the existing Endereco; 2 - Informed Endereco don't have an ID creating a new Endereco")
    fun persistEndereco(
        @HeaderParam("Accept-Language") @ApiParam(required = true, allowableValues = "en, pt")
            lang: String,
        @HeaderParam("X-Client-Version") @ApiParam(required = true, example = "w1.1.0")
            clientVersion: String,
        @HeaderParam("Authorization") @ApiParam(required = true, example = "Bearer mytokenhere")
            authorization: String,

        @ApiParam(required = true)
            endereco: Endereco): Long {
        //TODO: review generated method
        return pipe.handle<Long> { con ->
            EnderecoProcess(con, getLang(lang), clientVersion)
                    .persist(endereco, extractToken(authorization))
        }
    }

    @GET
    @Path("/ExtensaoDoPrincipal/{id}")
    @ApiOperation(value = "Gets ExtensaoDoPrincipal of informed id")
    fun getExtensaoDoPrincipal(
        @PathParam("id") @ApiParam(required = true)
            id: Long?,

        @HeaderParam("Accept-Language") @ApiParam(required = true, allowableValues = "en, pt")
            lang: String,
        @HeaderParam("X-Client-Version") @ApiParam(required = true, example = "w1.1.0")
            clientVersion: String,
        @HeaderParam("Authorization") @ApiParam(required = true, example = "Bearer mytokenhere")
            authorization: String): ExtensaoDoPrincipalResp {
        //TODO: review generated method
        return pipe.handle { con ->
            ExtensaoDoPrincipalProcess(con, getLang(lang), clientVersion).getOne(id, extractToken(authorization))
        }
    }

    @GET
    @Path("/ExtensaoDoPrincipal")
    @ApiOperation(value = "List ExtensaoDoPrincipal informations")
    fun listExtensaoDoPrincipal(
        @HeaderParam("Accept-Language") @ApiParam(required = true, allowableValues = "en, pt")
            lang: String,
        @HeaderParam("X-Client-Version") @ApiParam(required = true, example = "w1.1.0")
            clientVersion: String,
        @HeaderParam("Authorization") @ApiParam(required = true, example = "Bearer mytokenhere")
            authorization: String,

        @QueryParam("query") @ApiParam(value = "Query of search")
            query: String?,
        @QueryParam("page") @ApiParam(value = "Page index, null to not paginate")
            page: Int?,
        @QueryParam("limit") @ApiParam(value = "Page size, null to not paginate")
            limit: Int?,
        @QueryParam("orderBy") @ApiParam(value = "Identifier for sorting, usually a property name", example = "idPrincipalFk")
            orderRequest: String?,
        @QueryParam("ascending") @ApiParam(value = "True for ascending order", defaultValue = "false")
            asc: Boolean?): PagedResp<ExtensaoDoPrincipal> {
        //TODO: review generated method
        return pipe.handle { con ->
            ExtensaoDoPrincipalProcess(con, getLang(lang), clientVersion)
                    .list(extractToken(authorization), query, page, limit, orderRequest, asc != null && asc)
        }
    }

    @POST
    @Path("/ExtensaoDoPrincipal")
    @ApiOperation(value = "Persist a new or existing ExtensaoDoPrincipal", notes = "1 - Informed ExtensaoDoPrincipal have an ID editing the existing ExtensaoDoPrincipal; 2 - Informed ExtensaoDoPrincipal don't have an ID creating a new ExtensaoDoPrincipal")
    fun persistExtensaoDoPrincipal(
        @HeaderParam("Accept-Language") @ApiParam(required = true, allowableValues = "en, pt")
            lang: String,
        @HeaderParam("X-Client-Version") @ApiParam(required = true, example = "w1.1.0")
            clientVersion: String,
        @HeaderParam("Authorization") @ApiParam(required = true, example = "Bearer mytokenhere")
            authorization: String,

        @ApiParam(required = true)
            extensaoDoPrincipal: ExtensaoDoPrincipal): Long {
        //TODO: review generated method
        return pipe.handle<Long> { con ->
            ExtensaoDoPrincipalProcess(con, getLang(lang), clientVersion)
                    .persist(extensaoDoPrincipal, extractToken(authorization))
        }
    }

    @GET
    @Path("/GrupoDoPrincipal/{id}")
    @ApiOperation(value = "Gets GrupoDoPrincipal of informed id")
    fun getGrupoDoPrincipal(
        @PathParam("id") @ApiParam(required = true)
            id: Long?,

        @HeaderParam("Accept-Language") @ApiParam(required = true, allowableValues = "en, pt")
            lang: String,
        @HeaderParam("X-Client-Version") @ApiParam(required = true, example = "w1.1.0")
            clientVersion: String,
        @HeaderParam("Authorization") @ApiParam(required = true, example = "Bearer mytokenhere")
            authorization: String): GrupoDoPrincipalResp {
        //TODO: review generated method
        return pipe.handle { con ->
            GrupoDoPrincipalProcess(con, getLang(lang), clientVersion).getOne(id, extractToken(authorization))
        }
    }

    @GET
    @Path("/GrupoDoPrincipal")
    @ApiOperation(value = "List GrupoDoPrincipal informations")
    fun listGrupoDoPrincipal(
        @HeaderParam("Accept-Language") @ApiParam(required = true, allowableValues = "en, pt")
            lang: String,
        @HeaderParam("X-Client-Version") @ApiParam(required = true, example = "w1.1.0")
            clientVersion: String,
        @HeaderParam("Authorization") @ApiParam(required = true, example = "Bearer mytokenhere")
            authorization: String,

        @QueryParam("query") @ApiParam(value = "Query of search")
            query: String?,
        @QueryParam("page") @ApiParam(value = "Page index, null to not paginate")
            page: Int?,
        @QueryParam("limit") @ApiParam(value = "Page size, null to not paginate")
            limit: Int?,
        @QueryParam("orderBy") @ApiParam(value = "Identifier for sorting, usually a property name", example = "idGrupoDoPrincipalPk")
            orderRequest: String?,
        @QueryParam("ascending") @ApiParam(value = "True for ascending order", defaultValue = "false")
            asc: Boolean?): PagedResp<GrupoDoPrincipal> {
        //TODO: review generated method
        return pipe.handle { con ->
            GrupoDoPrincipalProcess(con, getLang(lang), clientVersion)
                    .list(extractToken(authorization), query, page, limit, orderRequest, asc != null && asc)
        }
    }

    @POST
    @Path("/GrupoDoPrincipal")
    @ApiOperation(value = "Persist a new or existing GrupoDoPrincipal", notes = "1 - Informed GrupoDoPrincipal have an ID editing the existing GrupoDoPrincipal; 2 - Informed GrupoDoPrincipal don't have an ID creating a new GrupoDoPrincipal")
    fun persistGrupoDoPrincipal(
        @HeaderParam("Accept-Language") @ApiParam(required = true, allowableValues = "en, pt")
            lang: String,
        @HeaderParam("X-Client-Version") @ApiParam(required = true, example = "w1.1.0")
            clientVersion: String,
        @HeaderParam("Authorization") @ApiParam(required = true, example = "Bearer mytokenhere")
            authorization: String,

        @ApiParam(required = true)
            grupoDoPrincipal: GrupoDoPrincipal): Long {
        //TODO: review generated method
        return pipe.handle<Long> { con ->
            GrupoDoPrincipalProcess(con, getLang(lang), clientVersion)
                    .persist(grupoDoPrincipal, extractToken(authorization))
        }
    }

    @GET
    @Path("/ItemDoPrincipal/{id}")
    @ApiOperation(value = "Gets ItemDoPrincipal of informed id")
    fun getItemDoPrincipal(
        @PathParam("id") @ApiParam(required = true)
            id: Long?,

        @HeaderParam("Accept-Language") @ApiParam(required = true, allowableValues = "en, pt")
            lang: String,
        @HeaderParam("X-Client-Version") @ApiParam(required = true, example = "w1.1.0")
            clientVersion: String,
        @HeaderParam("Authorization") @ApiParam(required = true, example = "Bearer mytokenhere")
            authorization: String): ItemDoPrincipalResp {
        //TODO: review generated method
        return pipe.handle { con ->
            ItemDoPrincipalProcess(con, getLang(lang), clientVersion).getOne(id, extractToken(authorization))
        }
    }

    @GET
    @Path("/ItemDoPrincipal")
    @ApiOperation(value = "List ItemDoPrincipal informations")
    fun listItemDoPrincipal(
        @HeaderParam("Accept-Language") @ApiParam(required = true, allowableValues = "en, pt")
            lang: String,
        @HeaderParam("X-Client-Version") @ApiParam(required = true, example = "w1.1.0")
            clientVersion: String,
        @HeaderParam("Authorization") @ApiParam(required = true, example = "Bearer mytokenhere")
            authorization: String,

        @QueryParam("query") @ApiParam(value = "Query of search")
            query: String?,
        @QueryParam("page") @ApiParam(value = "Page index, null to not paginate")
            page: Int?,
        @QueryParam("limit") @ApiParam(value = "Page size, null to not paginate")
            limit: Int?,
        @QueryParam("orderBy") @ApiParam(value = "Identifier for sorting, usually a property name", example = "idPrincipalFk")
            orderRequest: String?,
        @QueryParam("ascending") @ApiParam(value = "True for ascending order", defaultValue = "false")
            asc: Boolean?): PagedResp<ItemDoPrincipal> {
        //TODO: review generated method
        return pipe.handle { con ->
            ItemDoPrincipalProcess(con, getLang(lang), clientVersion)
                    .list(extractToken(authorization), query, page, limit, orderRequest, asc != null && asc)
        }
    }

    @POST
    @Path("/ItemDoPrincipal")
    @ApiOperation(value = "Persist a new or existing ItemDoPrincipal", notes = "1 - Informed ItemDoPrincipal have an ID editing the existing ItemDoPrincipal; 2 - Informed ItemDoPrincipal don't have an ID creating a new ItemDoPrincipal")
    fun persistItemDoPrincipal(
        @HeaderParam("Accept-Language") @ApiParam(required = true, allowableValues = "en, pt")
            lang: String,
        @HeaderParam("X-Client-Version") @ApiParam(required = true, example = "w1.1.0")
            clientVersion: String,
        @HeaderParam("Authorization") @ApiParam(required = true, example = "Bearer mytokenhere")
            authorization: String,

        @ApiParam(required = true)
            itemDoPrincipal: ItemDoPrincipal): Long {
        //TODO: review generated method
        return pipe.handle<Long> { con ->
            ItemDoPrincipalProcess(con, getLang(lang), clientVersion)
                    .persist(itemDoPrincipal, extractToken(authorization))
        }
    }

    @GET
    @Path("/Principal/{id}")
    @ApiOperation(value = "Gets Principal of informed id")
    fun getPrincipal(
        @PathParam("id") @ApiParam(required = true)
            id: Long?,

        @HeaderParam("Accept-Language") @ApiParam(required = true, allowableValues = "en, pt")
            lang: String,
        @HeaderParam("X-Client-Version") @ApiParam(required = true, example = "w1.1.0")
            clientVersion: String,
        @HeaderParam("Authorization") @ApiParam(required = true, example = "Bearer mytokenhere")
            authorization: String): PrincipalResp {
        //TODO: review generated method
        return pipe.handle { con ->
            PrincipalProcess(con, getLang(lang), clientVersion).getOne(id, extractToken(authorization))
        }
    }

    @GET
    @Path("/Principal")
    @ApiOperation(value = "List Principal informations")
    fun listPrincipal(
        @HeaderParam("Accept-Language") @ApiParam(required = true, allowableValues = "en, pt")
            lang: String,
        @HeaderParam("X-Client-Version") @ApiParam(required = true, example = "w1.1.0")
            clientVersion: String,
        @HeaderParam("Authorization") @ApiParam(required = true, example = "Bearer mytokenhere")
            authorization: String,

        @QueryParam("query") @ApiParam(value = "Query of search")
            query: String?,
        @QueryParam("page") @ApiParam(value = "Page index, null to not paginate")
            page: Int?,
        @QueryParam("limit") @ApiParam(value = "Page size, null to not paginate")
            limit: Int?,
        @QueryParam("orderBy") @ApiParam(value = "Identifier for sorting, usually a property name", example = "idGrupoDoPrincipalFk")
            orderRequest: String?,
        @QueryParam("ascending") @ApiParam(value = "True for ascending order", defaultValue = "false")
            asc: Boolean?): PagedResp<Principal> {
        //TODO: review generated method
        return pipe.handle { con ->
            PrincipalProcess(con, getLang(lang), clientVersion)
                    .list(extractToken(authorization), query, page, limit, orderRequest, asc != null && asc)
        }
    }

    @POST
    @Path("/Principal")
    @ApiOperation(value = "Persist a new or existing Principal", notes = "1 - Informed Principal have an ID editing the existing Principal; 2 - Informed Principal don't have an ID creating a new Principal")
    fun persistPrincipal(
        @HeaderParam("Accept-Language") @ApiParam(required = true, allowableValues = "en, pt")
            lang: String,
        @HeaderParam("X-Client-Version") @ApiParam(required = true, example = "w1.1.0")
            clientVersion: String,
        @HeaderParam("Authorization") @ApiParam(required = true, example = "Bearer mytokenhere")
            authorization: String,

        @ApiParam(required = true)
            principal: Principal): Long {
        //TODO: review generated method
        return pipe.handle<Long> { con ->
            PrincipalProcess(con, getLang(lang), clientVersion)
                    .persist(principal, extractToken(authorization))
        }
    }

    @DELETE
    @Path("/Principal/{id}")
    @ApiOperation(value = "Deletes the Principal of informed id")
    fun removePrincipal(
        @PathParam("id") @ApiParam(required = true)
            id: Long?,

        @HeaderParam("Accept-Language") @ApiParam(required = true, allowableValues = "en, pt")
            lang: String,
        @HeaderParam("X-Client-Version") @ApiParam(required = true, example = "w1.1.0")
            clientVersion: String,
        @HeaderParam("Authorization") @ApiParam(required = true, example = "Bearer mytokenhere")
            authorization: String): Any? {
        //TODO: review generated method
        return pipe.handle<Any?> { con ->
            PrincipalProcess(con, getLang(lang), clientVersion)
                    .remove(id, extractToken(authorization))
        }
    }

    @GET
    @Path("/Tag/{id}")
    @ApiOperation(value = "Gets Tag of informed id")
    fun getTag(
        @PathParam("id") @ApiParam(required = true)
            id: Long?,

        @HeaderParam("Accept-Language") @ApiParam(required = true, allowableValues = "en, pt")
            lang: String,
        @HeaderParam("X-Client-Version") @ApiParam(required = true, example = "w1.1.0")
            clientVersion: String,
        @HeaderParam("Authorization") @ApiParam(required = true, example = "Bearer mytokenhere")
            authorization: String): TagResp {
        //TODO: review generated method
        return pipe.handle { con ->
            TagProcess(con, getLang(lang), clientVersion).getOne(id, extractToken(authorization))
        }
    }

    @GET
    @Path("/Tag")
    @ApiOperation(value = "List Tag informations")
    fun listTag(
        @HeaderParam("Accept-Language") @ApiParam(required = true, allowableValues = "en, pt")
            lang: String,
        @HeaderParam("X-Client-Version") @ApiParam(required = true, example = "w1.1.0")
            clientVersion: String,
        @HeaderParam("Authorization") @ApiParam(required = true, example = "Bearer mytokenhere")
            authorization: String,

        @QueryParam("query") @ApiParam(value = "Query of search")
            query: String?,
        @QueryParam("page") @ApiParam(value = "Page index, null to not paginate")
            page: Int?,
        @QueryParam("limit") @ApiParam(value = "Page size, null to not paginate")
            limit: Int?,
        @QueryParam("orderBy") @ApiParam(value = "Identifier for sorting, usually a property name", example = "idTagPk")
            orderRequest: String?,
        @QueryParam("ascending") @ApiParam(value = "True for ascending order", defaultValue = "false")
            asc: Boolean?): PagedResp<Tag> {
        //TODO: review generated method
        return pipe.handle { con ->
            TagProcess(con, getLang(lang), clientVersion)
                    .list(extractToken(authorization), query, page, limit, orderRequest, asc != null && asc)
        }
    }

    @POST
    @Path("/Tag")
    @ApiOperation(value = "Persist a new or existing Tag", notes = "1 - Informed Tag have an ID editing the existing Tag; 2 - Informed Tag don't have an ID creating a new Tag")
    fun persistTag(
        @HeaderParam("Accept-Language") @ApiParam(required = true, allowableValues = "en, pt")
            lang: String,
        @HeaderParam("X-Client-Version") @ApiParam(required = true, example = "w1.1.0")
            clientVersion: String,
        @HeaderParam("Authorization") @ApiParam(required = true, example = "Bearer mytokenhere")
            authorization: String,

        @ApiParam(required = true)
            tag: Tag): Long {
        //TODO: review generated method
        return pipe.handle<Long> { con ->
            TagProcess(con, getLang(lang), clientVersion)
                    .persist(tag, extractToken(authorization))
        }
    }

    @GET
    @Path("/User/{id}")
    @ApiOperation(value = "Gets User of informed id")
    fun getUser(
        @PathParam("id") @ApiParam(required = true)
            id: Long?,

        @HeaderParam("Accept-Language") @ApiParam(required = true, allowableValues = "en, pt")
            lang: String,
        @HeaderParam("X-Client-Version") @ApiParam(required = true, example = "w1.1.0")
            clientVersion: String,
        @HeaderParam("Authorization") @ApiParam(required = true, example = "Bearer mytokenhere")
            authorization: String): UserResp {
        //TODO: review generated method
        return pipe.handle { con ->
            UserProcess(con, getLang(lang), clientVersion).getOne(id, extractToken(authorization))
        }
    }

    @GET
    @Path("/User")
    @ApiOperation(value = "List User informations")
    fun listUser(
        @HeaderParam("Accept-Language") @ApiParam(required = true, allowableValues = "en, pt")
            lang: String,
        @HeaderParam("X-Client-Version") @ApiParam(required = true, example = "w1.1.0")
            clientVersion: String,
        @HeaderParam("Authorization") @ApiParam(required = true, example = "Bearer mytokenhere")
            authorization: String,

        @QueryParam("query") @ApiParam(value = "Query of search")
            query: String?,
        @QueryParam("page") @ApiParam(value = "Page index, null to not paginate")
            page: Int?,
        @QueryParam("limit") @ApiParam(value = "Page size, null to not paginate")
            limit: Int?,
        @QueryParam("orderBy") @ApiParam(value = "Identifier for sorting, usually a property name", example = "idUserPk")
            orderRequest: String?,
        @QueryParam("ascending") @ApiParam(value = "True for ascending order", defaultValue = "false")
            asc: Boolean?): PagedResp<User> {
        //TODO: review generated method
        return pipe.handle { con ->
            UserProcess(con, getLang(lang), clientVersion)
                    .list(extractToken(authorization), query, page, limit, orderRequest, asc != null && asc)
        }
    }

    @POST
    @Path("/User")
    @ApiOperation(value = "Persist a new or existing User", notes = "1 - Informed User have an ID editing the existing User; 2 - Informed User don't have an ID creating a new User")
    fun persistUser(
        @HeaderParam("Accept-Language") @ApiParam(required = true, allowableValues = "en, pt")
            lang: String,
        @HeaderParam("X-Client-Version") @ApiParam(required = true, example = "w1.1.0")
            clientVersion: String,
        @HeaderParam("Authorization") @ApiParam(required = true, example = "Bearer mytokenhere")
            authorization: String,

        @ApiParam(required = true)
            user: User): Long {
        //TODO: review generated method
        return pipe.handle<Long> { con ->
            UserProcess(con, getLang(lang), clientVersion)
                    .persist(user, extractToken(authorization))
        }
    }

}

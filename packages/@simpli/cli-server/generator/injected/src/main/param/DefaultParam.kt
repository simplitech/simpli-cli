<%_ var packageAddress = options.serverSetup.packageAddress _%>
package <%-packageAddress%>.param

import <%-packageAddress%>.enums.Lang
import io.swagger.annotations.ApiParam
import javax.ws.rs.HeaderParam
import javax.ws.rs.QueryParam

/**
 * DefaultParam
 * Used as Bean parameters in the routers
 * @author Simpli CLI generator
 */
open class DefaultParam {
    @HeaderParam("Accept-Language")
    @ApiParam(allowableValues = "en-US, pt-BR", defaultValue = "en-US")
    var lang: String = Lang.EN_US.toString()

    @HeaderParam("X-Client-Version")
    @ApiParam(defaultValue = "w1.0.0")
    var clientVersion: String = "w1.0.0"

    open class Paged : DefaultParam() {
        @QueryParam("query")
        @ApiParam(value = "Query of search")
        var query: String? = null

        @QueryParam("page")
        @ApiParam(value = "Page index, null to not paginate")
        var page: Int? = null

        @QueryParam("limit")
        @ApiParam(value = "Page size, null to not paginate")
        var limit: Int? = null

        @QueryParam("orderBy")
        @ApiParam(value = "Identifier for sorting, usually a property name", example = "id")
        var orderRequest: String? = null

        @QueryParam("ascending")
        @ApiParam(value = "True for ascending order", defaultValue = "false")
        var asc: Boolean = false
    }

    open class Auth : DefaultParam() {
        @HeaderParam("Authorization")
        @ApiParam(required = true, example = "Bearer my-token-here")
        var authorization: String? = null
    }

    open class AuthPaged: Auth() {
        @QueryParam("query")
        @ApiParam(value = "Query of search")
        var query: String? = null

        @QueryParam("page")
        @ApiParam(value = "Page index, null to not paginate")
        var page: Int? = null

        @QueryParam("limit")
        @ApiParam(value = "Page size, null to not paginate")
        var limit: Int? = null

        @QueryParam("orderBy")
        @ApiParam(value = "Identifier for sorting, usually a property name", example = "id")
        var orderRequest: String? = null

        @QueryParam("ascending")
        @ApiParam(value = "True for ascending order", defaultValue = "false")
        var asc: Boolean = false
    }
}

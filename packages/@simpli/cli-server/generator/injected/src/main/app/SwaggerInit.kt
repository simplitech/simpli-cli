<%_ var packageAddress = options.serverSetup.packageAddress _%>
<%_ var serverName = options.serverSetup.serverName _%>
<%_ var moduleName = options.serverSetup.moduleName _%>
<%_ var moduleNameCapitalized = options.serverSetup.capitalizeFirstLetter(moduleName) _%>
package <%-packageAddress%>.app

import io.swagger.jaxrs.config.SwaggerContextService
import io.swagger.models.Info
import io.swagger.models.Swagger
import io.swagger.models.auth.OAuth2Definition
import javax.servlet.ServletConfig
import javax.servlet.ServletException
import javax.servlet.http.HttpServlet

/**
 * Swagger Init
 * Initializes the swagger documentation
 * @author Simpli CLI generator
 */
class SwaggerInit : HttpServlet() {

    @Throws(ServletException::class)
    override fun init(config: ServletConfig) {
        val info = Info()
                .title("<%-serverName%>")
                .description("Welcome to <%-serverName%> API documentation.")

        val swagger = Swagger().info(info)

        swagger.securityDefinition("Authorization", OAuth2Definition().implicit("<%-moduleName%>/auth"))
    
        SwaggerContextService().withServletConfig(config).updateSwagger(swagger)
    }

}

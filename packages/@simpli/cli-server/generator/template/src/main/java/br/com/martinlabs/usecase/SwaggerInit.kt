package br.com.martinlabs.usecase

import io.swagger.models.auth.*
import io.swagger.jaxrs.config.SwaggerContextService
import io.swagger.models.Info
import io.swagger.models.Swagger
import javax.servlet.ServletConfig
import javax.servlet.ServletException
import javax.servlet.http.HttpServlet

/**
 * Inits the swagger documentation
 * @author martinlabs CRUD generator
 */
class SwaggerInit : HttpServlet() {
    @Throws(ServletException::class)
    override fun init(config: ServletConfig) {
        val info = Info()
                .title("GeneratorUseCase")
                .description("Welcome to GeneratorUseCase API documentation.")

        val swagger = Swagger().info(info)

        swagger.securityDefinition("Authorization", 
                OAuth2Definition()
                        .implicit("Crud/Login"))
    
        SwaggerContextService().withServletConfig(config).updateSwagger(swagger)
    }
}

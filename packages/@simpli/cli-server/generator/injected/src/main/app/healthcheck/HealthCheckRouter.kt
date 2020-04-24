<%_ var packageAddress = options.serverSetup.packageAddress _%>
package <%-packageAddress%>.app.healthcheck

import <%-packageAddress%>.wrapper.RouterWrapper
import io.swagger.v3.oas.annotations.Operation
import javax.ws.rs.GET
import javax.ws.rs.Path

/**
 * Routing the API address into HealthCheck
 * @author Simpli CLI generator
 */
@Path(HealthCheckRouter.PATH)
class HealthCheckRouter : RouterWrapper() {
    companion object {
        const val PATH = "/healthcheck"
    }

    @GET
    @Operation(tags = ["HealthCheck"], summary = "Checks status of DB connection and coroutines")
    fun check(): Boolean {
        HealthCheckPipe.apply {
            return handle(connectionPipe) { con ->
                HealthCheckProcess(con).check()
            } &&
            handle(transactionPipe) { con ->
                HealthCheckProcess(con).check()
            }
        }
    }
}

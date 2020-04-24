<%_ var packageAddress = options.serverSetup.packageAddress _%>
package <%-packageAddress%>.app

import <%-packageAddress%>.app.env.Props
import <%-packageAddress%>.app.env.PropsBeta
import <%-packageAddress%>.app.env.PropsProduction
import <%-packageAddress%>.app.env.PropsStaging
import <%-packageAddress%>.enums.Mode
import org.apache.logging.log4j.LogManager

/**
 * Facade
 * @author Simpli CLI generator
 */
object Facade {
    private val logger = LogManager.getLogger(Facade::class.java)

    /**
     * Enviroment mode: BETA, STAGING or PRODUCTION
     */
    @JvmStatic val Env: Props

    init {
        val mode = Mode.fromString(System.getProperty("ENVIRONMENT")) ?: Mode.BETA.also {
            logger.warn("System property not found for ENVIRONMENT. Using Mode.BETA as default")
        }

        Env = when (mode) {
            Mode.PRODUCTION -> PropsProduction()
            Mode.STAGING -> PropsStaging()
            Mode.BETA -> PropsBeta()
        }
    }
}

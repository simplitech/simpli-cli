<%_ var packageAddress = options.serverSetup.packageAddress _%>
package <%-packageAddress%>.app.env

import <%-packageAddress%>.enums.Mode

/**
 * Environment Variables - Production
 * @author Simpli CLI generator
 */
class PropsProduction : Props(Mode.PRODUCTION) {
    override val APP_DEFAULT_ORIGIN = "http://localhost:8181"
}


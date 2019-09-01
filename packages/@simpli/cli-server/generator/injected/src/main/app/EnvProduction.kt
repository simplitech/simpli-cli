<%_ var database = options.serverSetup.connection.database _%>
<%_ var projectDomain = options.serverSetup.projectDomain _%>
<%_ var serverName = options.serverSetup.serverName _%>
<%_ var packageAddress = options.serverSetup.packageAddress _%>
package <%-packageAddress%>.app

import <%-packageAddress%>.enums.Lang
import <%-packageAddress%>.locale.EnUs
import <%-packageAddress%>.locale.PtBr
import com.amazonaws.regions.Regions

/**
 * Environment Variables - Production
 * @author Simpli CLI generator
 */
open class EnvProduction {
    open val isProduction = true

    /**
     * If set true then it provides more information in the log such as client requests
     * Not recommended in production mode
     */
    open val detailedLog = false

    /**
     * Database DS name
     * Do not change it unless you know what you are doing
     */
    open val dsName = "jdbc/<%-options.serverSetup.connection.database%>DS"

    /**
     * Default Web Application Origin
     */
    open val appDefaultOrigin = "http://localhost:8181"

    /**
     * Available Languages
     */
    open val availableLanguages get() = hashMapOf(
            Lang.EN_US to EnUs(),
            Lang.PT_BR to PtBr()
    )

    /**
     * E-Mail server information
     * Go to AwsCredentials.properties to set your AWS credentials
     */
    open val emailSenderProvider = "no-reply@<%-projectDomain%>"
    open val emailAwsRegion get() = Regions.US_EAST_1

    /**
     * Forgotten password token expiration time in days
     * @default 15 days
     */
    open val forgottenPasswordTokenLife = 15

    /**
     * Set the DATE_FORMAT if you know what you are doing
     * @default yyyy-MM-dd'T'HH:mm:ssXXX
     */
    open val dateFormat = "yyyy-MM-dd'T'HH:mm:ssXXX"

    /**
     * Hash to transform data into token
     * @warning DO NOT SHARE this hash in order to keep your project safe
     * Your are able to change it whenever you want, but all clients must login again
     */
    open val encryptHash = "<%-options.serverSetup.uuid()%>"

    /**
     * Credentials used in Unit Test
     * The Unit Test always happens in localhost
     * Not recommended to change these values
     */
    open val testerDatabase = "<%-options.serverSetup.connection.database%>"
    open val testerId = 1L

    open val testerLogin = "test@test.com"
    open val testerPassword = "tester"
}

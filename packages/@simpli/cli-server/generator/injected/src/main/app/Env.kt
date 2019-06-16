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
 * Environment Variables
 * @author Simpli CLI generator
 */
object Env {
    /**
     * @warning
     * Make sure that production mode is TRUE in the MASTER branch
     * Make sure that production mode is FALSE in the DEV branch
     */
    const val PRODUCTION_MODE: Boolean = false

    /**
     * If set true then it provides more information in the log such as client requests
     * Not recommended in production mode
     */
    const val DEBUG_MODE: Boolean = true

    /**
     * Database DS name
     * Do not change it unless you know what you are doing
     */
    const val DS_NAME = "jdbc/<%-options.serverSetup.connection.database%>DS"

    /**
     * Default Web Application Origin
     */
    const val APP_DEFAULT_ORIGIN = "http://localhost:8181"

    /**
     * Available Languages
     */
    val AVAILABLE_LANGUAGES get() = hashMapOf(
            Lang.EN_US to EnUs(),
            Lang.PT_BR to PtBr()
    )

    /**
     * E-Mail server information
     * Go to AwsCredentials.properties to set your AWS credentials
     */
    const val EMAIL_SENDER_PROVIDER = "no-reply@<%-projectDomain%>"
    val EMAIL_AWS_REGION get() = Regions.US_EAST_1

    /**
     * Forgotten password token expiration time in days
     * @default 15 days
     */
    const val FORGOTTEN_PASSWORD_TOKEN_LIFE = 15

    /**
     * Set the DATE_FORMAT if you know what you are doing
     * @default yyyy-MM-dd'T'HH:mm:ssXXX
     */
    const val DATE_FORMAT = "yyyy-MM-dd'T'HH:mm:ssXXX"

    /**
     * Hash to transform data into token
     * @warning DO NOT SHARE this hash in order to keep your project safe
     * Your are able to change it whenever you want, but all clients must login again
     */
    const val ENCRYPT_HASH = "<%-options.serverSetup.uuid()%>"

    /**
     * Credentials used in Unit Test
     * The Unit Test always happens in localhost
     * Not recommended to change these values
     */
    const val TESTER_DATABASE = "<%-options.serverSetup.connection.database%>"
    const val TESTER_CLIENT_VERSION = "w1.0.0"
    const val TESTER_ID = 1L
    const val TESTER_LOGIN = "test@test.com"
    const val TESTER_PASSWORD = "tester"
}

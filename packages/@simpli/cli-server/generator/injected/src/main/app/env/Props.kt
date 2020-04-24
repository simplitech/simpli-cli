<%_ var database = options.serverSetup.connection.database _%>
<%_ var projectDomain = options.serverSetup.projectDomain _%>
<%_ var serverName = options.serverSetup.serverName _%>
<%_ var packageAddress = options.serverSetup.packageAddress _%>
package <%-packageAddress%>.app.env

import <%-packageAddress%>.enums.Lang
import <%-packageAddress%>.enums.Mode
import <%-packageAddress%>.locale.EnUs
import <%-packageAddress%>.locale.PtBr
import com.amazonaws.regions.Regions

/**
 * Environment Variables - Base
 * @author Simpli CLI generator
 */
abstract class Props(val MODE: Mode) {
    /**
     * Database DS name
     * Do not change it unless you know what you are doing
     */
    val DS_NAME = "jdbc/<%-options.serverSetup.connection.database%>DS"

    /**
     * Default Web Application Origin
     */
    abstract val APP_DEFAULT_ORIGIN: String

    /**
     * Available Languages
     */
    val AVAILABLE_LANGUAGES = hashMapOf(
        Lang.EN_US to EnUs(),
        Lang.PT_BR to PtBr()
    )

    /**
     * E-Mail server information
     * Go to AwsCredentials.properties to set your AWS credentials
     */
    val EMAIL_SENDER_PROVIDER = "no-reply@<%-projectDomain%>"
    val EMAIL_AWS_REGION = Regions.US_EAST_1

    /**
     * Forgotten password token expiration time in days
     * @default 15 days
     */
    val FORGOTTEN_PASSWORD_TOKEN_LIFE = 15

    /**
     * Set the DATE_FORMAT if you know what you are doing
     * @default yyyy-MM-dd'T'HH:mm:ssXXX
     */
    val DATE_FORMAT = "yyyy-MM-dd'T'HH:mm:ssXXX"

    /**
     * Hash to transform data into token
     * @warning DO NOT SHARE this hash in order to keep your project safe
     * Your are able to change it whenever you want, but all clients must login again
     */
    val ENCRYPT_HASH = "<%-options.serverSetup.uuid()%>"

    /**
     * Credentials used in Unit Test
     * The Unit Test always happens in localhost
     * Not recommended to change these values
     */
    val TESTER_DATABASE = "<%-options.serverSetup.connection.database%>"
    val TESTER_ID = 1L
    val TESTER_LOGIN = "test@test.com"
    val TESTER_PASSWORD = "tester"
}

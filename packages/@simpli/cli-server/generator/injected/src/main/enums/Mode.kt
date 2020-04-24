<%_ var packageAddress = options.serverSetup.packageAddress _%>
package <%-packageAddress%>.enums

/**
 * Mode enum
 * Represents the environment of application
 * @author Simpli CLI generator
 */
enum class Mode {
    BETA, STAGING, PRODUCTION;

    companion object {
        fun fromString(string: String?): Mode? {
            return string?.run { values().firstOrNull { it.name.equals(this, true) } }
        }
    }
}

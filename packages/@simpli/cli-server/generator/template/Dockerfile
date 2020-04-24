FROM tomcat:alpine

# Declaring build args
ARG ENVIRONMENT=beta
ARG LOG_LEVEL=debug
ARG DB_URL=<%-options.serverSetup.connection.host%>
ARG DB_NAME=<%-options.serverSetup.connection.database%>
ARG DB_USER=<%-options.serverSetup.connection.user%>
ARG DB_PASS=<%-options.serverSetup.connection.password%>

# Declaring environment variables based on build args, but can be overwritten
ENV ENVIRONMENT=$ENVIRONMENT
ARG LOG_LEVEL=$LOG_LEVEL
ENV DB_URL=$DB_URL
ENV DB_NAME=$DB_NAME
ENV DB_USER=$DB_USER
ENV DB_PASS=$DB_PASS

USER root
RUN rm -rf /usr/local/tomcat/webapps/
COPY ./target/<%-options.serverSetup.serverName%>.war /usr/local/tomcat/webapps/ROOT.war

RUN echo "export JAVA_OPTS=\"\$JAVA_OPTS -DENVIRONMENT=\$ENVIRONMENT -DLOG_LEVEL=\$LOG_LEVEL -DDB_URL=\$DB_URL -DDB_NAME=\$DB_NAME -DDB_USER=\$DB_USER -DDB_PASS=\$DB_PASS\"" > $CATALINA_HOME/bin/setenv.sh

CMD ["catalina.sh", "run"]

# Class chedule
## General info
This repository contains a source code of Class Schedule Project.

The main goal of the project is designing a website where university or institute staff will be able to create, store and display their training schedules.

Link to the development version of site: https://develop-softserve.herokuapp.com/

## Creating local repository
In order to create a local copy of the project you need:
1. Download and install the last version of Git https://git-scm.com/downloads
2. Open a terminal and go to the directory where you want to clone the files. 
3. Run the following command. Git automatically creates a folder with the repository name and downloads the files there.

       git clone https://gitlab.com/class_schedule/class_schedule.backend.git
4. Enter your username and password if GitLab requests.

## Database
1. Download and install the last version of PostgreSQL https://www.postgresql.org/download/
2. Configure your username, password and connection url in `hibernate.properties` file

## Starting backend server using IntelliJ IDEA and Tomcat
1. Download and install Ultimate version of IntelliJ IDEA (alternatively you can use trial or EAP versions) https://www.jetbrains.com/idea/download
2. Download and install Tomcat 9.0.50 https://tomcat.apache.org/download-90.cgi
3. Start IDE and open class_schedule.backend project from the folder where you previously download it.
4. Make sure Tomcat and TomEE Integration is checked (`File –>> Settings –>> Plugins`).
5. `Run –>> Edit Configurations…`
6. Clicks `+` icon, select `Tomcat Server –>> Local`
7. Clicks on “Server” tab, then press `Configure...` button and select a Tomcat server
8. Clicks on the “Deployment” tab, then press `+` icon to select an artifact to deploy, and select `Gradle:com.softserve:class_schedule.war`
9. Press OK to save configuration
10. `Run –>> Run 'Tomcat 9.0.50'` to start backend server

## Starting frontend server using Node.js
1. Download and install Node.js 14.17.4 LTS version https://nodejs.org/en/
2. Open a terminal in `/frontend` directory of the downloaded project and run the following command.

       npm install
3. After the finishing of installation run the following command to start frontend server

       npm start
# A project with a awesome shop API

## How to start this project
Clone the project and make sure you have the following programs installed: docker, nodejs and yarn. See installation for the correct platform.

### 1a. Installation Linux
#### NodeJS
See https://github.com/nodesource/distributions/blob/master/README.md on how to install NodeJS. Look on the NodeJS website to find the latest LTS version. The command used in this URL uses `curl` make sure you install this first, `sudo apt install curl`.

#### Yarn
See https://legacy.yarnpkg.com/lang/en/docs/install/#debian-stable on how to install Yarn.

#### Docker
See https://docs.docker.com/install/linux/docker-ce/ubuntu/ and follow the steps for 'Install using the repository'


### 1b. Installation Windows
**This could only be done on a Windows 10 Pro or Enterprise edition.**

#### NodeJS
Download and install the LTS version of https://nodejs.org/en/. 

#### Yarn
See https://legacy.yarnpkg.com/lang/en/docs/install/#windows-stable on how to install Yarn.

#### Docker
For Windows see https://docs.docker.com/docker-for-windows/install/ and follow the instructions. This could only be done on a Windows 10 Pro or Enterprise edition.

### How to start the server
Open a terminal / command prompt / Power shell, and type `yarn development-[yourplatform]`. This will compose two docker containers and link them together. 

Example:
`yarn development-linux`

Your site will be running on http://localhost:5000

 

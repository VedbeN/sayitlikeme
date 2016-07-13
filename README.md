# sayitlike.me
Are you annoyed by those who can't pronounce your name the way you like it?
Do you get sad when you can't call someone's name with grace?.  
Sayitlike.me is an open source effort to solve that problem.

Users can login with their twitter account, record their name, and they'll get a personal URL
like this:
http://sayitlike.me/YourTwitterHandle

That URL can be shared with anyone that need to know how to pronounce the name.

# Help Needed
No matter what technical skills you have, any help would be appreciated. For example with: suggestions for improving the idea, designing a logo, etc... just open an issue and let's talk

## The rest is just development notes
## User stories
  * map sayitlike.me/twitterhandle to a page for @twitterhandle on twitter containing an audio recording of the name

## Components
### First phase
  * Login
  * User page (only with written instruction for pronunciation)
  * Search

### Second Phase
  * Recordings need to be added to users pages

## Mongoose instructions from
https://scotch.io/tutorials/using-mongoosejs-in-node-js-and-mongodb-applications

## Should we swtich to neDB?
NeDB is a simple embedded data store that can be used instead of MongoDB in small apps.
Benefit of using that is easier project setup as no mongodb will be needed. 

## Routing 
Requirements
  * all sayitlike.me/twitterHandle, need to be routed to app/index.html 
  * all sayitlike.me/api-/twitterHandle, need to return JSON, containging user info
  * all static files need to be served from /public as such 

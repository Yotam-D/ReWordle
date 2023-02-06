async function validate(userName,pass,db) {
    let check = await db
        .select('username','password').from('rewordleusers')
        .then(data => {
            return data.some(user => userName == user.username && pass == user.password)
        })
        .catch(err=>console.log('catch Err',err))
    return check 
}

async function getUserInfo(userName,pass,db){
    let info = await db('rewordleusers')
    .join('words', 'rewordleusers.progress', '=', 'words.word_id')
    .then(data => {
        return data.find(user =>(user.username==userName && user.password == pass))
        })
    return info;
}

async function updateUser(userInfo,db){
    let user = await db('rewordleusers')
    .join('words', 'rewordleusers.progress', '=', 'words.word_id')
    .where('userID', '=', `${userInfo.userID}`)
    .update({
        progress: userInfo.progress+1,
        // progress: user_prog+1,
        thisKeyIsSkipped: undefined
      })
    .returning('*')

    .then(data => {
        return data
        // .find(user =>(user.userID==user_id))
        })
    return user;
} 


module.exports ={
    validate,
    getUserInfo,
    updateUser
}
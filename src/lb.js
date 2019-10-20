App42.initialize("c9d8301a8c60bb9505e6e81cf0610312317016815023abcd489a1ec45a7b4409", "51a1559b1e5e762f4c232e5f6b71ba3ce1d19588e79d8e46c491c67d377bff17");
var scoreBoardService  = new App42ScoreBoard();  
class Score{
    constructor(newName, newScore){
         this.name = newName;
         this.score = newScore;
    }
    upload(){
        
        var gameName = "Gari The Space Cleaner",  
        userName = this.name,  
        gameScore = this.score,  
        result ;    
        scoreBoardService.saveUserScore(gameName,userName,gameScore,{    
            success: function(object)   
            {    
                console.log("uploaded new score by " + userName);
                /*var game = JSON.parse(object);    
                result = game.app42.response.games.game;  
                console.log("gameName is : " + result.name)  
                var scoreList = result.scores.score;  
                console.log("userName is : " + scoreList.userName)  
                console.log("scoreId is : " + scoreList.scoreId)  
                console.log("value is : " + scoreList.value)  */
            },    
            error: function(error) { 
                console.log(error)   
            }    
        });  
    }
}

let topTenScores = [];
function sortTopTen() {
    topTenScores.sort(( a, b ) => {
        if ( a.score > b.score ){
          return -1;
        }
        if ( a.score < b.score ){
          return 1;
        }
        return 0;
    })
}
function updateTopTen(){
    //App42.initialize("c9d8301a8c60bb9505e6e81cf0610312317016815023abcd489a1ec45a7b4409", "51a1559b1e5e762f4c232e5f6b71ba3ce1d19588e79d8e46c491c67d377bff17");
    var gameName = "Gari The Space Cleaner",    
    max = 100000,  
    result;
    scoreBoardService.getTopNRankings(gameName,max,{    
        success: function(object)   
        {    
            var game = JSON.parse(object);    
            result = game.app42.response.games.game;  
            //console.log("gameName is : " + result.name)  
            topTenScores.length = 0;
            var scoreList = result.scores.score;  
            if (scoreList instanceof Array) {  
                    for (var i = 0; i < scoreList.length; i++) {  
                        let score = new Score(scoreList[i].userName, scoreList[i].value);
                        //console.log(score);
                        var rep = 0;
                        for(var j = 0; j < topTenScores.length; j++){
                            if(topTenScores[j].name.toLowerCase() == score.name.toLowerCase()){
                                rep = 1;
                            }
                        }
                        if(topTenScores.length > 10) break;
                        if(rep == 0) topTenScores.push(score);

                    }  
                } else {  
                    let score = new Score(scoreList.userName, scoreList.value);
                    topTenScores.push(score)
                }  
        },    
        error: function(error) {   
            console.log(error) 
        }    
    });   
}
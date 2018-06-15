$(document).ready(function(){


	$.ajax({
        url: 'questions.json',
        dataType: 'jsonp',
        jsonpCallback: 'callback',
        success: function(json){

		function Quiz (quizObject, quizName){
			this.quiz = quizObject;
			this.selections = [];
			this.questionNumber = 0;
			this.quizName = quizName;

			this.proceedToNextQuestion = function(selected){

					if (this.questionNumber == (this.quiz.length - 1) && selected.length > 0){   // If we are on the last question
						this.selections[this.questionNumber] = selected.val(); 	//add the selection to the selections array
						saveSelectionToStorage();                        	//Save the selection to the local storage for this user
						$('.' + this.quizName + ' label, .' + this.quizName + ' br').remove();                   //Remove all choices from the document
						this.printScore();                                  	 //Print the player's score
						this.questionNumber++;                              	//Make sure to increase the quiz1QuestionNumber in case they hit the back button it will go back to the last question
					}else if(selected.length == 0){
						alert("Please select an answer");      	//Otherwise, if no selection is made, ask the user to select
					} else{

						this.selections[this.questionNumber] = selected.val();          //Otherwise, add the selection to the selections array
						saveSelectionToStorage();                                  //Save the selection to the local storage for this user

						$('.' + this.quizName + ' label, .' + this.quizName + ' br').remove();                   //Remove all choices from the document
						this.questionNumber++;                                          //Increase the index so we can retrieve the next question
						this.printQuestion();                         //Call the print function so we can print the next question

						if(typeof this.selections[this.questionNumber]  !== 'undefined'){     //After the next question is on the screen, check if there is already a selection saved in array
							this.fillSelection();                                   //If so, fill the selection
						}

					}
			}

			this.proceedToPreviousQuestion = function(){

				$('.' + this.quizName + ' label, .' + this.quizName + ' br').remove();                   //Remove all choices from the document

				if (this.questionNumber == (this.quiz.length) ){              	//If we are on the score page
					$('div[class="score ' + this.quizName + '"]').remove();					//Delete the final score number
					$('div[class="scoreTitle ' + this.quizName + '"]').remove();					//Delete the 'final score' heading
				}

				this.questionNumber--;					//Decrease this number so we are pointing to the previous question
				this.printQuestion(this.questionNumber);      //Prints the previous question  (since we decreased quiz1QuestionNumber)
				this.fillSelection(this.questionNumber);       //Autofill the selection
			}

			this.printQuestion = function(){

					var question = this.quiz[this.questionNumber].question;
					var choices = this.quiz[this.questionNumber].choices;

					var newQuestion = $('<label class="btn btn-lg btn-primary btn-block ' + this.quizName + '">' + question + '</label><br>');
					newQuestion.hide().prependTo('div[id="question"][class="' + this.quizName + '"]').fadeIn(2000);

					for(var i=0; i < choices.length; i++){
						var button = $('<label class="btn btn-lg btn-info btn-block ' + this.quizName + '"><input type="radio" name="choices" value=' + i + '>' + choices[i] + '</label><br>');
						button.hide().prependTo('div[id="choices"][class="' + this.quizName + '"]').fadeIn(2000);
					}
					this.disableButtons();
		
			}

			this.fillSelection = function(){

					var currentSelection = this.selections[this.questionNumber];            //the index of the selected answer that was chosen
					$('.' + this.quizName + ' input[value="' + currentSelection + '"]').prop('checked', true);
			}

			this.printScore = function(){

					var text = $('<div class="scoreTitle ' + this.quizName + '">Final Score:</div>');
					text.hide().prependTo('div[id="question"][class="' + this.quizName + '"]').fadeIn(2000);

					var totalScore = 0;
					for(var i=0; i < this.quiz.length; i++){
						if(this.selections[i] == this.quiz[i].correctAnswer){
							totalScore++;
							console.log(totalScore);
						}
					}

					var button = $('<div class="score ' + this.quizName + '"></div>');
					button.hide().prependTo('div[id="choices"][class="' + this.quizName + '"]').fadeIn(2000);

					$('div[class="score ' + this.quizName + '"]').text("" + ((totalScore / this.quiz.length) * 100) + "%");

					$('input[id="nextButton"][data-quiz="' + this.quizName + '"]').prop('disabled', true);                 //Player is on last page (score page), so disable the next button

			}

			this.disableButtons = function(){

					if( this.questionNumber != 0){    //If player is not on the first or last question
						$('input[id="backButton"][data-quiz="' + this.quizName + '"]').prop('disabled', false);                      //make both submit buttons available
						$('input[id="nextButton"][data-quiz="' + this.quizName + '"]').prop('disabled', false);
					}else if(this.questionNumber == 0){                                       //If player is on first question, disable the back button
						$('input[id="backButton"][data-quiz="' + this.quizName + '"]').prop('disabled', true);
					}
			}

		}


            var quiz1 = new Quiz(json.firstQuiz, "quiz1");      //Store the first quiz questions & choices
    		var quiz2 = new Quiz(json.secondQuiz, "quiz2");		//Store the second quiz questions & choices
    		var quiz3 = new Quiz(json.thirdQuiz, "quiz3");		//Store the third quiz questions & choices

    		getAnswers();

			quiz1.printQuestion();
		    quiz2.printQuestion();
		    quiz3.printQuestion();

		    quiz1.fillSelection();
		    quiz2.fillSelection();
		    quiz3.fillSelection();
        
    
	

			$('input[value="Back"]').on('click', function(event)
			{
				event.preventDefault();

				var quizName = $(this).data('quiz');     //Checks which quiz is being used.  This is stored in the button's 'data-quiz' attribute

				switch (quizName){
					case 'quiz1':
								quiz1.proceedToPreviousQuestion();			
						break;
					case 'quiz2':
								quiz2.proceedToPreviousQuestion();
						break;
					case 'quiz3':
								quiz3.proceedToPreviousQuestion();
						break;
				} 
			});

			$('input[value="Next"]').on('click', function(event)
			{  

				event.preventDefault();

				var quizName = $(this).data('quiz');     //Checks which quiz is being used.  This is stored in the button's 'data-quiz' attribute

				var choices = $('.' + quizName + ' input[type="radio"]');   //This grabs all the choices for the current quiz
				var selected = choices.filter(":checked");                    //This grabs the button that is selected


				switch (quizName){
					case 'quiz1':
								quiz1.proceedToNextQuestion(selected);			
						break;
					case 'quiz2':
								quiz2.proceedToNextQuestion(selected);
						break;
					case 'quiz3':
								quiz3.proceedToNextQuestion(selected);
						break;
				} 

			});



		    function getAnswers()
		    {

				if(localStorage.getItem("answers") !== null){     	//If answers are saved locally
					console.log("Answers are stored locally");
		    		var answers = JSON.parse(localStorage.getItem("answers"));

					quiz1.selections = answers.quiz1selections;
					quiz2.selections = answers.quiz2selections;
					quiz3.selections = answers.quiz3selections;	    		
		    	} else {
					console.log("Answers are not stored");
		    		var newAnswers = {'quiz1selections' : [], 'quiz2selections' : [], 'quiz3selections' : []};
					localStorage.setItem("answers", JSON.stringify(newAnswers));

		    	}
		    }

		    function saveSelectionToStorage()
		    {
		    		var answers = JSON.parse(localStorage.getItem("answers"));    //Since its a string, call JSON.parse to convert it to an object

					answers.quiz1selections = quiz1.selections;           //Save the quiz1 selections inside the answers' quiz1 array
					answers.quiz2selections = quiz2.selections;			//Save the quiz2 selections inside the answers' quiz2 array
					answers.quiz3selections = quiz3.selections;			//Save the quiz3 selections inside the answers' quiz3 array

					localStorage.setItem("answers", JSON.stringify(answers));     //All changes have been made to the object, store it back into localStorage as a string.
		    }



		}   //end the success callback inside ajax
	});     //end the ajax call

});  //end file
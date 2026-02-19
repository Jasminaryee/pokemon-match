window.addEventListener("load", function (event) {
    // Retrieve important DOM elements
    let help = document.getElementById("help");
    let instructions = document.getElementById("instructions");

    let open = false;
    let username = document.getElementById("username");
    let username_warning = document.getElementById("username_warning");
    let difficulty = document.getElementById("difficulty");
    let rounds = document.getElementById("rounds");
    let rounds_warning = document.getElementById("rounds_warning");
    let submitbutton = document.getElementById("submitbutton");


    // hides various divs
    document.getElementById("game_easy").style.display = "none";
    document.getElementById("easy_hidden").style.display = "none";
    document.getElementById("game_medium").style.display = "none";
    document.getElementById("instructions").style.display = "none";
    document.getElementById("scoreboard").style.display = "none";
    document.getElementById("game_over").style.display = "none";
    document.getElementById("thankyou").style.visibility = "hidden";
    document.getElementById("sorry").style.display = "none";





    // allows user to click on help icon to get game instructions
    help.addEventListener("click", function (event) {
        if (open) {
            instructions.style.display = "none";
            this.src = "images/help_icon.png";
            open = false;
        } else {
            instructions.style.display = "flex";
            this.src = "images/hamburgerclose.png";
            open = true;
        }
    });

    // allows  the user to chnage form and gameplay divs background colurs
    // Source: Professor Sam Scott
    let c = document.getElementById("colorbox");
    c.addEventListener("input", function(event) {
        let form = document.getElementById("form");
        let easy_mode = document.getElementById("easy_mode")
        form.style["background-color"] = this.value;
        easy_mode.style["background-color"] = this.value;
    });


    // Checks that form has been completely filled
    // function isform_filled is sourced from professor sam scott
    function isform_filled() {
        // start by assuming we're ok
        let ok1 = true;
        let ok2 = true;


        // check if username has been entered
        if (username.value < 1) {
            ok1 = false; // we're not ok
            username_warning.style["display"] = "block";
            username.style["outline-color"] = "red"; // used when element has focus
            username.style["border-color"] = "red";
        } else {
            username_warning.style["display"] = "none";
            username.style["outline-color"] = "";
            username.style["border-color"] = "";
        }

        // check if number of rounds has been entered
        if (rounds.value.trim() === "") {
            ok2 = false; // we're not ok
            rounds_warning.style["display"] = "block";
            rounds.style["outline-color"] = "red"; // used when element has focus
            rounds.style["border-color"] = "red";
        } else {
            rounds_warning.style["display"] = "none";
            rounds.style["outline-color"] = "";
            rounds.style["border-color"] = "";

        }

         // Check if difficulty is set to Medium
         if (difficulty.value == "Medium") {
            document.getElementById("sorry").style.display = "block";
            submitbutton.disabled = true;
            return;
        } else {
            document.getElementById("sorry").style.display = "none";
        }

        // enable/disable submit button
        if (ok1 == true && ok2 == true) {
            submitbutton.disabled = false;
        } else {
            submitbutton.disabled = true;

        }
    }



    // add event listeners to input fields
    username.addEventListener("input", isform_filled);
    rounds.addEventListener("change", isform_filled);
    difficulty.addEventListener("input", isform_filled);


    submitbutton.addEventListener("click", function (event) {
        document.getElementById("form").style.display = "none";


        // shows differnt levels based on user choise easy/medium
        if (difficulty.value == "Easy") {
            document.getElementById("game_easy").style.display = "block";
            document.getElementById("easy_hidden").style.display = "block";
            document.getElementById("scoreboard").style.display = "block";

        }if (difficulty.value == 'Medium'){
            // medium has not been implemented yet

            // document.getElementById("game_medium").style.display = "block";

        }
    });

    let score = 0
    let round = 1
    // all game logic
    function game() {

        // Card flipping logic
        let num_flipped = 0;
        let compare_cards = []
        let flipped_tiles = []


        // if card is clicked and the class contains hidden hide the image
        document.getElementById("game_easy").addEventListener("click", function (event) {
            if (event.target.tagName === "IMG" && event.target.classList.contains("hidden")) {
                event.target.style.visibility = "hidden";

                // get the id of the tile clicked and removes id from it then stores it in an array
                let revealed_tile = document.getElementById(event.target.id.replace("hidden_", ""));
                compare_cards.push(revealed_tile.src);
                flipped_tiles.push(event.target);

                num_flipped += 1;
                if (num_flipped === 2) {
                    setTimeout(is_match, 800)
                }
            }
        });


        // function to hide cards after 2 have been clicked and match is false
        function flip_card() {
            flipped_tiles.forEach(tile => tile.style.visibility = "visible");

        }

        // evaluates whther two cards chosen are a match
        let matchTotal = 0

        function is_match() {
            if (compare_cards[0] !== compare_cards[1]) {
                match = false;
                flip_card();
            } else {
                match = true;
                matchTotal += 1
                score += 10;
                document.getElementById("score").innerHTML = "SCORE: " + score;
                console.log(matchTotal)

            }
            // if matchTotal = 6 it means everything is matched so call game again and make all the 'flipabble' cards visible again
            if (matchTotal == 6) {
                matchTotal = 0
                round += 1;
                document.getElementById("round").innerHTML = "ROUND: " + round;

                resetGame();
            }
            compare_cards = [];
            flipped_tiles = [];
            num_flipped = 0;
            console.log(match)

        }
        // resets the grid of images with new randomized possition one a round is complete
        // if the amount of rounds the user chose has been reached display game over screen
        function resetGame() {
            if (round > rounds.value) {
                document.getElementById("scoreboard").style.display = "none";
                document.getElementById("game_easy").style.display = "none";
                document.getElementById("easy_hidden").style.display = "none";

                // game over message with users enterend name and final score
                document.getElementById("goodjob").innerHTML = "Good job " + username.value +"!";
                document.getElementById("final_score").innerHTML = "FINAL SCORE: " + score;
                document.getElementById("game_over").style.display = "block";
                let no = document.getElementById("no");

                // if no is clicked display thank you message
                no.addEventListener("click", function (event) {
                    document.getElementById("thankyou").style.visibility = "visible";
                    document.getElementById("choice").style.display = "none";
                });
                // if yes is clicked reload the whole page
                let yes = document.getElementById("yes");
                yes.addEventListener("click", function (event) {
                    location.reload();
                });

                // makes the 'flippable' cards visable again
            } else {
                for (let i = 1; i < 13; i++) {
                    document.getElementById("hidden_tile" + i).style.visibility = "visible";
                }
                let shuffled_array_easy = shuffleArray(unshuffled_array_easy);
                assignImagesToTiles(shuffled_array_easy);
                console.log(round)
                console.log(rounds.value)
            }
        }



        // creates array of images used for both easy and medium then shuffles them
        // tried to create one array for both but the slicing method wouldve spilt pairs (try again more efficient)
        let unshuffled_array_easy = ["images/squirtle.jpg",
            "images/pikachu.jpg", "images/marowak.jpg", "images/ivysaur.jpg",
            "images/clefairy.jpg", "images/charmeleon.jpg",

            "images/squirtle.jpg",
            "images/pikachu.jpg", "images/marowak.jpg", "images/ivysaur.jpg",
            "images/clefairy.jpg", "images/charmeleon.jpg"]

        let unshuffled_array_medium = ["images/staryu.jpg", "images/squirtle.jpg",
            "images/pikachu.jpg", "images/marowak.jpg", "images/ivysaur.jpg",
            "images/clefairy.jpg", "images/charmeleon.jpg", "images/staryu.jpg",
            "images/vileplume.jpg",

            "images/staryu.jpg", "images/squirtle.jpg",
            "images/pikachu.jpg", "images/marowak.jpg", "images/ivysaur.jpg",
            "images/clefairy.jpg", "images/charmeleon.jpg", "images/staryu.jpg",
            "images/vileplume.jpg"]




        // function to shuffle each array
        // Fisher-Yates (Knuth Shuffle) Source: Stack overflow (https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array)
        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }

        let shuffled_array_easy = shuffleArray(unshuffled_array_easy);
        let shuffled_array_medium = shuffleArray(unshuffled_array_medium);

        // assigns images to html grid
        function assignImagesToTiles(shuffledArray) {
            for (let i = 0; i < shuffledArray.length; i++) {
                document.getElementById("tile" + (i + 1)).src = shuffledArray[i];
            }
        }

        // For easy version
        assignImagesToTiles(shuffled_array_easy);

        // // For medium version
        // assignImagesToTiles(shuffled_array_medium);
    }

    game();
});




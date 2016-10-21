function process() {
    var candidate = document.forms["input"].elements["palindrome"].value;
    
    if (isPalindrome(candidate)) {
        document.getElementById("output").innerHTML = candidate + " is a palindrome.";
    }
    else {
        document.getElementById("output").innerHTML = candidate + " is not a palindrome.";
    }
}

function isPalindrome(word) {
    word = word.toLowerCase();  // ignore case
    
    for (var i = 0; i < word.length; i++) {
        if (word[i] !== word[word.length - i - 1]) {
            return false;  // we found two characters that are unequal
        }
        if (i === word.length - i - 1) { 
            break;  // our indexes crossed each other so we've checked the whole word
        }
    }
    
    return true;
}
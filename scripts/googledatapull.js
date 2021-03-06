var requestTeacher;
var teacherResult;
var requestStudent;
var courses = new Array(0);

/** The chain of API calls and processing starts here.   */
function makeApiCall(subject) {
    console.log("makeApiCall() has been called");
    var paramsTeacher = {
        // The ID of the spreadsheet to retrieve data from.
        spreadsheetId: '1NbW7gqNM16eUSU43DXGj7xdi_Po5Gb-m8EQqSSRE4Bw', // TODO: Update placeholder value.

        // The A1 notation of the values to retrieve.
        range: subject, // TODO: Update placeholder value.

        // How values should be represented in the output.
        // The default render option is ValueRenderOption.FORMATTED_VALUE.
        //valueRenderOption: '',  // TODO: Update placeholder value.

        // How dates, times, and durations should be represented in the output.
        // This is ignored if value_render_option is
        // FORMATTED_VALUE.
        // The default dateTime render option is [DateTimeRenderOption.SERIAL_NUMBER].
        // dateTimeRenderOption: '',  // TODO: Update placeholder value.
    };

    //Teacher request:
    requestTeacher = gapi.client.sheets.spreadsheets.values.get(paramsTeacher);
    requestTeacher.then(function(response) {
        // TODO: Change code below to process the `response` object:
        createTeacherCourseArray(response.result, subject); //This sends the object to process response.result into 
        //an array
    }, function(reason) {
        console.error('error: ' + reason.result.error.message);
    });

    //next attempt:
    //Use two functions.  One builds teacher array.  Then student api data is pulled, and function is called.  
    //The function builds the student part of the array and adds it to the course object in the array
    //displayCourses() is then called


    //Student request:


}

function studentFeedbackApiCall() {
    var studentFeedbackApiCallComplete = false;
    console.log("studentFeedbackAPICall() has been called");
    var paramsStudent = {
        // The ID of the spreadsheet to retrieve data from.
        spreadsheetId: '1vvAMq9n8vQAa6Q8S51x3J5Bqmg1OVFX6LFNjECdNZ-E', // TODO: Update placeholder value.

        // The A1 notation of the values to retrieve.
        range: 'Student Responses', // TODO: Update placeholder value.

        // How values should be represented in the output.
        // The default render option is ValueRenderOption.FORMATTED_VALUE.
        //valueRenderOption: '',  // TODO: Update placeholder value.

        // How dates, times, and durations should be represented in the output.
        // This is ignored if value_render_option is
        // FORMATTED_VALUE.
        // The default dateTime render option is [DateTimeRenderOption.SERIAL_NUMBER].
        // dateTimeRenderOption: '',  // TODO: Update placeholder value.
    };

    requestStudent = gapi.client.sheets.spreadsheets.values.get(paramsStudent);
    requestStudent.then(function(response) {
        // TODO: Change code below to process the `response` object:
        //console.log("Student Data has been succesfully pulled");
        for (var i = 0; i < courses.length; i++) {
            var courseName = courses[i].name;
            for (var x = 0; x < response.result.values.length; x++) {
                if (courseName == response.result.values[x][1]) {
                    /*console.log("Course name: " + courseName + "; " + response.result.values[x][1]);
                    console.log("success");*/
                    var newStudentFeedback = buildStudentFeedback(response.result.values[x]);
                    courses[i].addStudentFeedback(newStudentFeedback);
                    //console.log("student is happening");
                    /*console.log(courses[i].studentFeedback);*/
                }
            }

        }
        /*console.log("studentAPICall is being set to true");
        studentFeedbackApiCallComplete = true;*/
        displayCourses(courses);
    }, function(reason) {
        console.error('error: ' + reason.result.error.message);
    });
    /*while (studentFeedbackApiCallComplete == false) {

    }*/
    console.log("studentFeedbackAPICall() is done");
    studentFeedbackComplete = true;

}

function initClient() {
    var API_KEY = 'AIzaSyDk4a4sXUHRt4HzCUiR3pAqV0er_PR6bgc'; // TODO: Update placeholder with desired API key.

    var CLIENT_ID = '969721645018-jp86ek5ps09fn4hdl01b1pccr94to0bi.apps.googleusercontent.com'; // TODO: Update placeholder with desired client ID.

    // TODO: Authorize using one of the following scopes:
    //   'https://www.googleapis.com/auth/drive'
    //   'https://www.googleapis.com/auth/drive.file'
    //   'https://www.googleapis.com/auth/drive.readonly'
    //   'https://www.googleapis.com/auth/spreadsheets'
    //   'https://www.googleapis.com/auth/spreadsheets.readonly'
    var SCOPE = 'https://www.googleapis.com/auth/spreadsheets.readonly';

    gapi.client.init({
        'apiKey': API_KEY,
        'clientId': CLIENT_ID,
        'scope': SCOPE,
        'discoveryDocs': ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
    }).then(function() {
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSignInStatus);
        updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    });
}

function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

function updateSignInStatus(isSignedIn) {
    makeApiCall("English");
    /*makeApiCall("Social Studies");
    makeApiCall("Math");
    makeApiCall("Science");
    makeApiCall("IT/CTE");*/
}

function checkResponseValidity(response) {
    if (response.trim() == "") {
        return null;
    } else return response;
}

function copyArray(copyArr) {
    var newArray = new Array(copyArr.length);
    for (var i = 0; i < copyArr.length; i++) {
        newArray[i] = copyArr[i];
    }
    return newArray;
}

function createTeacherCourseArray(result, subject) { //it comes here second, after making the API call. 
    console.log("createTeacherCourseArray() has been called");
    /**
     * Go through array of pulled data and create new courseList array
     */
    for (var r = 1; r < result.values.length; r++) {
        var name = result.values[r][0];
        var subject = subject;
        var countyDesc = result.values[r][1];
        var credits = result.values[r][2];
        var teacherWorkTime = result.values[r][3];
        var regularCounterPart = result.values[r][4];
        var advancedCounterPart = result.values[r][5];
        var advRegDiff = result.values[r][6];
        var teacherUsefulSkills = result.values[r][7];
        var teacherLearn = result.values[r][8];
        var teacherBenefits = result.values[r][9];
        var teacherRequiredPrereqs = result.values[r][10];
        var teacherRecommendedPrereqs = result.values[r][11];
        var teacherFeedback = new TeacherFeedback(teacherWorkTime, teacherRequiredPrereqs, teacherRecommendedPrereqs,
            teacherUsefulSkills, teacherLearn, teacherBenefits);
        var newCourse = new Course(name, subject, credits, countyDesc, regularCounterPart, advancedCounterPart,
            advRegDiff, teacherFeedback);
        courses.push(newCourse);
    }
    studentFeedbackApiCall(); //This sends it to studentFeedbackAPICall()
    /* console.log("This is about to call the displayCourses function.");
     console.log(courses[0].studentFeedback);*/
    /* while (studentFeedbackComplete == false) {
         //wait for studentFeedback to complete before displaying courses
     }*/


}

function buildStudentFeedback(courseInfo) {
    var workTime = courseInfo[2];
    var surviveClass = courseInfo[3];
    var learn = courseInfo[4];
    var challenge = courseInfo[5];
    var expectationDiff = courseInfo[6];
    return new StudentFeedback(workTime, surviveClass, learn, challenge, expectationDiff);
}
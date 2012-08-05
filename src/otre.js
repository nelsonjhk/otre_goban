// Otre: A Go Studying Program
// Copyright (c) 2011, Josh <jrhoak@gmail.com>
// Code licensed under the MIT License

(function(window) {

// Welcome to the Source Code for Otre!
//
// Otre.instance
//    |
//    | (initializes)
//    |
//    Display
//    -The Display contains all the methods associated with the gui.  Once the
//    -display is initialized, it relies on user interaction through the
//    -interface.  There are essentially no 'public' methods on Display beyond
//    -initialize.
//        |
//        | (has) 
//        |
//        guiStones --communicates to-> Logic
//        /
//        | (contains)
//        |
//        Logic (Generic/Game/Rules)
//            |
//            | (contains)
//            |
//            MoveTree
//                |
//                | (contains)
//                |
//                parsed SGF
//            /
//            |
//            | (contains)
//            |
//            Goban

// From JQuery: expose Otre to the global object
otre = window.otre || {};

})(window);

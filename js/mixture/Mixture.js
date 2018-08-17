   $(function() {
       $(".grid").mixItUp({
           selectors: {
               target: ".grid-item" // As in mixitup
           },
           layout: {
               display: "flex" // As in mixitup
           },
           loadmore: {
               // The number of items to start with
               initial: 8,
               // The number of items to load on click on the loadmore button
               loadMore: 2,
               // A selector string for the existing wrapper the buttons will be inserted into
               buttonWrapper: ".loadmore",
               // The class of the Load more button
               buttonClass: "loadmore-button",
               // The label of the Load more button
               buttonLabel: "Load more",
               // The class of the less button
               lessClass: "loadmore-less",
               // The label of the less button
               lessLabel: "Reset"
           }
       });
   });
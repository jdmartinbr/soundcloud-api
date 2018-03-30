function drag(ev){
    ev.dataTransfer.setData("text",ev.target.id);
}
function allowDrop(ev){
    ev.preventDefault();
}
function drop(ev){
    ev.preventDefault();
    let data = ev.dataTransfer.getData("text");
    console.log(document.getElementById(data));
    ev.target.value = document.getElementById(data).title;
    let query = data;
    $('#sound').toggleClass('pulse');
    SC.stream('/tracks/'+ query +'').then(function(player){
        player.play().then(function(){
            console.log('Playback started!');
        }).catch(function(e){
            console.error('Playback rejected. Try calling play() from a user interaction.', e);
        });
    });
}

$(document).ready(function() {

    let titles = [];

    SC.initialize({
        client_id: 'ID de cliente',
    });

    $(document).bind('keypress', function(e) {
        if(e.keyCode==13){ $('#searchSongs').trigger('click');}
    });

    $("#searchSongs").click(function() {
        $("#songList").children().remove();
        let query = $("#songToQuery").val();
        SC.get('/tracks', {
            q: query
        })
        .then(function(tracks) {
            titles = tracks;
            console.log(tracks);
            titles.forEach( function(val) {
                let avatar = val.artwork_url;
                if(val.artwork_url === null) avatar = val.user.avatar_url;
                let avatarEl = '<div class="col5 mb-3 mt-3 d-flex justify-content-center"><img title="'+ val.title +'" id="'+ val.id +'"ondragstart="drag(event)" draggable="true" src="'+ avatar + '"></img></div>';
                $("#songList").append(avatarEl);
            })
        });
    });
});


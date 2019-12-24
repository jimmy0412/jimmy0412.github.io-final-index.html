var keyboard = document.getElementById("lottery_data");
var default_keyboard = document.getElementById("default_lottery_data");
// roulette canvas 
var roulette = document.getElementById('roulette');
var ctx = roulette.getContext('2d');
var head = document.getElementById("head");

let canvasHeight = 600;
let canvasWidth = 600;

//let ctx_color = ["#f8ec31", "#8cc63f", "#009344", "#00a69d", "#27a9e0", "#1c75bb", "#2b388f", "#652c90", "#9e1f62", "#be1e2d", "#f05a28", "#f6931d"];
let color_order = [];

let default_lottery_member = ["速食", "水餃", "炒飯", "炒麵", "拉麵", "便當", "麵包", "炸雞", "披薩", "便利商店", "牛肉麵"];
let lottery_member = default_lottery_member;

let member_id_order = 1;
let default_spin_angle = Math.PI * 4 / 180;
let spin_angle = default_spin_angle;
var spin;

let outer_radius = 200;
let text_radius = 160;

let pixel;
let click_color = "#000000";

function byte2Hex(n) {
    var nybHexString = "0123456789ABCDEF";
    return String(nybHexString.substr((n >> 4) & 0x0F, 1)) + nybHexString.substr(n & 0x0F, 1);
}

function RGB2Color(r, g, b) {
    return '#' + byte2Hex(r) + byte2Hex(g) + byte2Hex(b);
}

function getColor(item, maxitem) {
    var phase = 0;
    var center = 128;
    var width = 127;
    var frequency = Math.PI * 2 / maxitem;

    red = Math.sin(frequency * item + 2 + phase) * width + center;
    green = Math.sin(frequency * item + 0 + phase) * width + center;
    blue = Math.sin(frequency * item + 4 + phase) * width + center;

    return RGB2Color(red, green, blue);
}

function add_default_member_to_list() {
    $('#lottery_member_list').empty();
    for (let i = 0; i < default_lottery_member.length; i++) {
        var $add_member = $('<option>').attr('member_id', member_id_order);
        $add_member.text(default_lottery_member[i]);
        $add_member.attr('default', true);
        $('#lottery_member_list').append($add_member);
        member_id_order++;
    }
}

function add_member_to_list(text) {
    var $add_member = $('<option>').attr('member_id', member_id_order);
    $add_member.text(text);
    $add_member.attr('default', false);
    $('#lottery_member_list').append($add_member);
    member_id_order++;
}


function draw_roulette() {

    ctx.font = 'bold 16px Helvetica, Arial';
    ctx.globalAlpha = 1;
    //畫分隔線
    for (let i = 0; i < lottery_member.length; i++) {
        let text = lottery_member[i];
        ctx.fillStyle = getColor(i, lottery_member.length);


        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(outer_radius * Math.cos((Math.PI * 2 * i) / lottery_member.length), outer_radius * Math.sin((Math.PI * 2 * i) / lottery_member.length));
        ctx.arc(0, 0, outer_radius, Math.PI * 2 * i / lottery_member.length, Math.PI * 2 * (i + 1) / lottery_member.length, false);
        ctx.lineTo(0, 0);
        ctx.fill();
        ctx.save();

        //write word
        ctx.fillStyle = "black";
        ctx.translate(text_radius * Math.cos(Math.PI * 2 * (i + 0.5) / lottery_member.length), text_radius * Math.sin(Math.PI * 2 * (i + 0.5) / lottery_member.length))
        ctx.rotate(Math.PI / 2 + Math.PI * 2 * (i + 0.5) / lottery_member.length);
        ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
        ctx.restore();
    }
}

function rotate() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.translate(canvasWidth / 2, canvasHeight / 2);
    ctx.rotate(spin_angle);
    draw_roulette();
    ctx.translate(-canvasWidth / 2, -canvasHeight / 2);
}

function set_up_btn() {
    var $up_btn = $('<button>').addClass('btn btn-danger speed_up_btn');
    $up_btn.attr('id', 'up');
    $up_btn.attr('disabled', '');
    //icon
    var $icon = $('<i>').addClass('fas');
    $icon.addClass('fa-arrow-circle-up');
    $up_btn.append($icon);
    $('#btn_pos').append($up_btn);
}

function set_down_btn() {
    var $down_btn = $('<button>').addClass('btn btn-primary speed_down_btn ');
    $down_btn.attr('id', 'down');
    $down_btn.attr('disabled', '');
    //icon
    var $icon = $('<i>').addClass('fas fa-arrow-circle-down');

    $down_btn.append($icon);
    $('#btn_pos').append($down_btn);
}

function set_go_btn() {
    var $go_btn = $('<button>').attr('id', 'go');
    $go_btn.addClass('lottery_btn');
    $go_btn.text('go');
    $('#btn_pos').append($go_btn);
}

function set_refresh_btn() {
    var $refresh_btn = $('<button>').attr('id', 'refresh');
    $refresh_btn.addClass('btn refresh_btn btn-dark');

    var $icon = $('<i>').addClass('fas fa-sync');
    $refresh_btn.append($icon);
    $('#btn_pos').append($refresh_btn);
}

function set_stop_btn() {
    var $stop_btn = $('<button>').attr('id', 'stop');
    $stop_btn.addClass('btn stop_btn btn-secondary');
    $stop_btn.attr('disabled', '');

    var $icon = $('<i>').addClass('far fa-stop-circle');
    $stop_btn.append($icon);
    $('#btn_pos').append($stop_btn);
}

function set_btn() {
    set_go_btn();
    set_up_btn();
    set_down_btn();
    set_refresh_btn();
    set_stop_btn();
}

function start_spin() {
    spin = setInterval(rotate, 1);
}

function stop_spin() {
    clearInterval(spin);
}

function spin_speed_up() {
    spin_angle *= 1.5;
}

function spin_speed_down() {
    spin_angle /= 1.5;
}

function go_available() {
    $('#go').on('click', () => {
        $('#up').removeAttr('disabled');
        $('#down').removeAttr('disabled');
        $('#stop').removeAttr('disabled');
        $('#go').attr('disabled', '');
        start_spin();
    })
}

function up_availible() {
    $('#up').on('click', () => {
        spin_speed_up();
    })
}

function down_availible() {
    $('#down').on('click', () => {
        spin_speed_down();
    })
}

function refresh_avilible() {
    $('#refresh').on('click', () => {
        spin_angle = default_spin_angle;
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.translate(canvasWidth / 2, canvasHeight / 2);
        draw_roulette();
        ctx.translate(-canvasWidth / 2, -canvasHeight / 2);
    })
}

function stop_availible() {
    $('#stop').on('click', () => {
        stop_spin();
        $('#go').removeAttr('disabled');
        $('#up').attr('disabled', '');
        $('#down').attr('disabled', '');
        $('#stop').attr('disabled', '');
    })
}



function btn_avalible() {
    go_available();
    up_availible();
    down_availible();
    refresh_avilible();
    stop_availible();
}

function delete_list_member() {
    //remove d
    for (let i = 0; i < $('#lottery_member_list option:selected').length; i++) {
        let index = lottery_member.indexOf($('#lottery_member_list option:selected')[i].text);
        lottery_member.splice(index, 1);
    }
    $('#lottery_member_list option:selected').remove();
}

function remove_btn() {
    $('.lottery_btn').remove();
    $('.speed_up_btn').remove();
    $('.speed_down_btn').remove();
    $('.refresh_btn').remove();
    $('.stop_btn').remove();
}


function able_input() {
    $('#delete').removeAttr('disabled');
    $('#lottery_member_list').removeAttr('disabled');
    $('#lottery_data').removeAttr('disabled');
    $('#default_lottery_data').removeAttr('disabled');
    $('#lottery_data_ok').removeAttr('disabled');
    $('#default_lottery_data_ok').removeAttr('disabled');
}

function disable_input() {
    $('#delete').attr('disabled', '');
    $('#lottery_member_list').attr('disabled', '');
    $('#lottery_data').attr('disabled', '');
    $('#default_lottery_data').attr('disabled', '');
    $('#lottery_data_ok').attr('disabled', '');
    $('#default_lottery_data_ok').attr('disabled', '');
}

function init() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    remove_btn();
    lottery_member = default_lottery_member;
    $('#lottery_member_list').empty();
    member_id_order = 1;
    add_default_member_to_list();
    stop_spin();
    spin_angle = default_spin_angle;
    able_input();
    $('#start').attr('disabled', '');
    $('#ok').attr('disabled', '');
}

function disable_change_speed() {
    $('#up').attr('disabled', '');
    $('#down').attr('disabled', '');
    $('#refresh').attr('disabled', '');
    $('#stop').attr('disabled', '');
    $('#go').attr('disabled', '');
}

function setting_ok() {
    $('#start').removeAttr('disabled');
    $('#ok').attr('disabled', '');
    stop_spin();
    disable_input();
    disable_change_speed();
}

function delete_gift() {
    $('#gift').addClass('gift_invisible');
    $('#gift').empty();
}

function continue_availible() {
    $('#continue').on('click', () => {
        delete_gift();
        start_spin();
        start_mouse();
    })
}

function show_gift(text) {
    var $h1 = $('<h1>').addClass('display-4').text("YA!!!");
    var $hr = $('<hr>').addClass('my-4');
    var $text = $('<p>').text("抽到" + text + "啦!!!  那就去吃" + text + "吧");
    var $btn = $('<button>').attr('id', 'continue');
    $btn.addClass('btn btn-warning').text("繼續抽獎");
    $('#gift').append($h1);
    $('#gift').append($hr);
    $('#gift').append($text);
    $('#gift').append($btn);

    $('#gift').removeClass('gift_invisible');
    stop_spin();
    continue_availible();
    cancel_mouse();
}

function mouse_click(e) {
    let x = e.clientX - roulette.offsetLeft - 1;
    let y = e.clientY - head.offsetHeight - 1;
    pixel = ctx.getImageData(x, y, 1, 1).data;
    click_color = String(RGB2Color(pixel[0], pixel[1], pixel[2]));
    console.log(x)
    console.log(y)
    if (click_color == "#000000") {
        alert('請投進轉盤中');
    } else {

        if (color_order.indexOf(click_color) < 0)
            alert("sorry 你按到的地方，作者功力淺薄，無法判定，麻煩再抽一次")
        else {
            let winner = lottery_member[color_order.indexOf(click_color)];
            show_gift(winner);
        }
    }
}

function cancel_mouse() {
    roulette.removeEventListener('click', mouse_click);
}

function start_mouse() {
    roulette.addEventListener('click', mouse_click);
}

function get_color_array() {
    for (let i = 0; i < lottery_member.length; i++) {
        color_order.push(getColor(i, lottery_member.length));
    }
}



function start_lottery() {
    let black = "#FFFFFF";
    let white = "#000000";
    get_color_array();
    start_spin();
    start_mouse();
}
$(() => {
    // include default member 
    add_default_member_to_list();

    //set default member
    $('#default_lottery_data_ok').on('click', () => {
        if ($(default_lottery_data).val().replace(/ */, "") === "") {
            default_lottery_member = [];
            lottery_member = default_lottery_member;
            add_default_member_to_list();
        } else {
            //multiple input handle 
            let member = [];
            member = $(default_lottery_data).val().trim().split(/ *, *| *; *| +/); // split by "," or " " or ";"
            default_lottery_member = member;
            lottery_member = default_lottery_member;
            add_default_member_to_list();

            document.getElementById('default_lottery_data').value = '';
        }
        default_keyboard.addEventListener("keyup", (event) => {
            if (event.keyCode === 13) {
                event.preventDefault();
                document.getElementById("default_lottery_data_ok").click();
            }
        });
    })

    // input lottery data     
    $('#lottery_data_ok').on('click', () => {
            // is null input 
            if ($(lottery_data).val().replace(/ */, "") === "")
                alert('無輸入抽獎資料，請不要空白，重新輸入');
            else {
                //multiple input handle 
                let member = [];
                member = $(lottery_data).val().trim().split(/ *, *| *; *| +/); // split by "," or " " or ";" 
                for (let i = 0; i < member.length; i++) {
                    // add to member list 
                    add_member_to_list(String(member[i]));
                    //add to array 
                    lottery_member.push(String(member[i]));
                }
                //clear button data
                document.getElementById('lottery_data').value = '';
            }
        })
        //input data with enter
    keyboard.addEventListener("keyup", (event) => {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById("lottery_data_ok").click();
        }
    });

    // show roulette
    $('#show_roulette').on('click', () => {
            // show go btn 
            stop_spin();
            if (lottery_member.length < 2)
                alert('請至少輸入二名抽獎成員');
            else {
                //check double ckick of show_roulette
                $('#ok').removeAttr('disabled');
                set_btn();

                ctx.translate(canvasWidth / 2, canvasHeight / 2);
                draw_roulette();
                ctx.translate(-canvasWidth / 2, -canvasHeight / 2);

                btn_avalible();
                $('#show_roulette').attr('disabled', '');
            }
        })
        //reset
    $('#reset').on('click', () => {
        init();
        $('#show_roulette').removeAttr('disabled');
        cancel_mouse();
    })

    $('#delete').on('click', () => {
        delete_list_member();
    })
    $('#ok').on('click', () => {
        setting_ok();
    })
    $('#start').on('click', () => {
        $('#start').attr('disabled', '');
        start_lottery();
    })
})
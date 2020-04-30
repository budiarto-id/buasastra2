String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

window._submit = false;

var teks = "";

async function share(title, text, url) {
  if (window.Windows) {
    const DataTransferManager = window.Windows.ApplicationModel.DataTransfer.DataTransferManager;

    const dataTransferManager = DataTransferManager.getForCurrentView();
    dataTransferManager.addEventListener("datarequested", (ev) => {
      const data = ev.request.data;

      data.properties.title = title;
      data.properties.url = url;
      data.setText(text);
    });

    DataTransferManager.showShareUI();

    return true;
  } else if (navigator.share) {
    try {
      await navigator.share({
        title: title,
        text: text,
        url: url,
      });

      return true;
    } catch (err) {
      console.error('There was an error trying to share this content');
      return false;
    }
  }
}

async function copyToClipboard(stringToCopy) {
  if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(stringToCopy);
      console.log('string copied to clipboard');
	  M.toast({html: 'Arti kata berhasil disalin', classes: 'green lighten-4 black-text'});
    } catch (err) {
      console.error('Failed to copy: ', err);
	  M.toast({html: 'Arti kata gagal disalin. '+err, classes: 'red lighten-4 black-text'});
    }
  }
}

function copyText(){
	let lema = $("#detail-lema").text();
	let q = lema.replaceAll('[\(\)]','').split(',')[0];
	let meaning = $("#detail-arti").text();
	let source = $("#detail-pustaka").text();
	let additional = "Diakses dari laman https://bausastra.tera.pw/q/"+q;
	let stringToCopy = lema + " " + meaning + "\n\n Sumber: " + source + "\n\n" + additional;
	copyToClipboard(stringToCopy);
}

function shareText(){
	let lema = $("#detail-lema").text();
	let q = lema.replaceAll('[\(\)]','').split(',')[0];
	let meaning = $("#detail-arti").text();
	let source = $("#detail-pustaka").text();
	let additional = "Diakses dari laman ";
	let text = lema + " " + meaning + "\n\n Sumber: " + source + "\n\n" + additional;
	share("Arti Kata "+lema, text, "https://bausastra.tera.pw/q/"+q);
}

function switch_panel(panel_id){
	$("#initial").hide();
	$("#result").hide();
	$("#err").hide();
	$("#loading").hide();
	$("#"+panel_id).show();
}

function detail(el){
	var $el = $(el);
	var entry = $el.find(".entry").html();
	var javanese = $el.find(".javanese").html();
	var meaning = $el.find(".meaning").html();
	var bibliography = $el.data("pustaka");
	$("#detail-jawa").html(javanese);
	$("#detail-lema").html(entry);
	$("#detail-arti").html(meaning);
	$("#detail-pustaka").html(bibliography);
	var modal = M.Modal.getInstance($("#modal1"));
	modal.open();
	tooltips = $("#modal1").find("a[data-toggle='tooltip']");
	$.each(tooltips,function(index,item){
		$(item).text($(item).data("tooltip"));
	});
}

function search(el){
	if(_submit==false){
		_submit = true;
		var $el = $('#'+el);
		$el.find("input[name*='search']").blur();
		switch_panel("loading");
		var query = $el.find("input[name*='search']").val().trim().toLowerCase();
		window.query = query;
		//var token = $el.find("input[name*='token']").val();
		if(!query) 
			query = "-";
		$.get(base_url + "words/search/"+query,function(res){
			if(!res.result){
				if(res.msg){
					switch_panel("err");
					var err = res.msg;
					$("#err_msg").html(err);
					//console.log(xhr.responseJSON.msg);
					_submit = false;
					return;
				}else{
					switch_panel("err");
					var err = '<span class="text-jawa">ꦏꦸꦢꦸꦚꦩ꧀ꦧꦸꦁꦆꦤ꧀ꦠꦼꦂꦤꦺꦠ꧀</span><br/>Sepurane lur. Aplikasi iki kudu nyambung internet.';
					$("#err_msg").html(err);
					//console.log(xhr.responseJSON.msg);
					_submit = false;
					return;
				}
			}
			$("#result").html("");
			//var html = '<li class="collection-item avatar"><a class="bausastra-ads" href="https://www.bukalapak.com/p/hobi-koleksi/buku/bahasa/fnkl56-jual-buku-iqra-hanacaraka-cara-mudah-belajar-aksara-jawa?keyword=" data-name="iqra" data-position="body"><img src="'+base_url+'assets/img/iqra1.jpg" alt="" class="circle" style="border-radius:0"><span class="title"><strong>Iqra Hanacaraka</strong></span><p>Klik di sini untuk Belajar Aksara Jawa dengan mudah dan menyenangkan.</p></a></li>';
			var html = '<li class="collection-item avatar"><a class="bausastra-ads" href="https://www.bukalapak.com/p/perlengkapan-kantor/alat-kantor/furniture-kantor/263u3bd-jual-kalender-jawa-aksara-jawa-tahun-1953?keyword=" data-name="iqra" data-position="body"><img src="https://s0.bukalapak.com/img/54823666331/w-1000/data.png.webp" alt="" class="circle" style="border-radius:0"><span class="title"><strong>Kalender Jawa Aksara Jawa</strong></span><p>Milikilah kalender Jawa dengan Aksara Jawa. Klik di sini.</p></a></li>';
			$("#result").append(html);
			$.each(res.result,function(i,item){
				var html = "<li class='collection-item avatar' style='padding-left: 10px; cursor: pointer' data-pustaka='"+item.bibliography+"' onclick='detail(this)'>"
					+"<a>"
					+"<span class='title'><strong class='entry'>"+item.entry+"</strong> <span class='text-jawa javanese'>"+item.javanese+"</span></span>"
					+"<p class='meaning'>"+item.meaning
					+"</p>"
					+"("+item.citation+")"
					+"</a>"
					+"</li>";
				$("#result").append(html);
			})
			switch_panel("result");
			_submit = false;
			$('[data-toggle="tooltip"]').tooltip();
		}).fail(function (xhr, textStatus, error) {
			switch_panel("err");
			if(xhr.responseJSON){
				$("#err_msg").html(xhr.responseJSON.msg);
				//console.log(xhr.responseJSON.msg);
			}else{
				var err = '<span class="text-jawa">ꦏꦸꦢꦸꦚꦩ꧀ꦧꦸꦁꦆꦤ꧀ꦠꦼꦂꦤꦺꦠ꧀</span><br/>Sepurane lur. Aplikasi iki kudu nyambung internet.';
				$("#err_msg").html(err);
			}
			_submit = false;
		});
	}
}

$(function () {
	if(window.query!=false){
		if($("#frm1").is(":hidden")){
			$("#frm2").find("input[name='search']").val(window.query);
			search("frm2");
		}else{
			$("#frm1").find("input[name='search']").val(window.query);
			search("frm1");
		}
	}
	var modal = M.Modal.init($("#modal1"), {
		onOpenEnd: function(){
			$('[data-toggle="tooltip"]').tooltip();
		}
	});
})
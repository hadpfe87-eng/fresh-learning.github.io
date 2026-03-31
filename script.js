const boneFacts = {
    skull: { title: "الجمجمة", text: "الجمجمة تحمي أهم عضو في جسمك: الدماغ!" },
    ribs: { title: "القفص الصدري", text: "تعمل الأضلاع مثل القفص لحماية القلب والرئتين." },
    spine: { title: "العمود الفقري", text: "يتكون من 33 فقرة تسمح لك بالوقوف والانحناء." },
    pelvis: { title: "عظم الحوض", text: "عظم الحوض هو الذي يربط عمودك الفقري بساقيك." },
    humerus: { title: "عظمة العضد", text: "هذه هي العظمة الطويلة في الجزء العلوي من ذراعك." },
    femur: { title: "عظمة الفخذ", text: "عظمة الفخذ هي أطول وأقوى عظمة في جسم الإنسان!" }
};

$(function() {
    // Make bones draggable
    $(".bone-item").draggable({
        revert: "invalid", // Snap back if dropped in wrong place
        cursor: "move",
        containment: "window"
    });

    // Make targets droppable
    $(".target").droppable({
        accept: function(draggable) {
            return $(this).data("bone") === draggable.data("target");
        },
        over: function() {
            $(this).addClass("highlight");
        },
        out: function() {
            $(this).removeClass("highlight");
        },
        drop: function(event, ui) {
            const boneId = ui.draggable.data("target");
            $(this).addClass("correct").removeClass("highlight");
            ui.draggable.fadeOut(); // Hide the dragged label
            
            showFact(boneId);
        }
    });

    function showFact(id) {
        const info = boneFacts[id];
        $("#bone-title").text(info.title);
        $("#bone-fact").text(info.text);
        $("#info-modal").removeClass("hidden");
    }

    $(".close-btn").click(function() {
        $("#info-modal").addClass("hidden");
    });
});

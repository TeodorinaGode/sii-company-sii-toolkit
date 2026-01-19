// here is the code that deals with the legacy systems.
export class SIILinkManager {
    constructor() {
        this.openedLinks = [];
    }
    openLink(menuVoice, openInThisWindow, companyId) {
        let urlToCall = menuVoice.link;
        const windowTarget = openInThisWindow ? '_self' : 'blank';
        const features = `target=${windowTarget},width=400,height=400,resizable=0,scrollbars=1,status=1,toolbar=0,menubar=0`;
        if (urlToCall.indexOf('?') < 0) {
            urlToCall += '?';
        }
        urlToCall += '&WebCacheLocalId=' + new Date().getTime().toString();
        if (companyId) {
            urlToCall += '&soccodice=' + companyId;
        }
        // the 2°parameter is the name of the opened window. if a window with the same name is opened, the same widow is used
        // if add the 3°parameter features , the new link is opened in a new window intead of tab
        const win = window.open(urlToCall, openInThisWindow ? '_self' : `${menuVoice.title}${(' - ' + companyId) || ''}`, features);
        if (!openInThisWindow) {
            win.addEventListener('load', () => {
                if (win.location.href.toLowerCase().indexOf('login') !== -1) {
                    console.log('sessione scaduta');
                    win.close();
                    window.location.reload();
                }
            }, false);
        }
        this.openedLinks.push(win);
        return win;
    }
    closeAllOpenedLinks() {
        for (const win of this.openedLinks) {
            win.close();
        }
    }
}
/*
window.SII_LEGACY = {};
(function (window, document, undefined) {
  window.SII_LEGACY.openedLinks = [];
  window.SII_LEGACY.openLinkInNewWIndow = (URL,companyId) => openLink(URL,companyId, '_blank');
  window.SII_LEGACY.closeAllOpenedLinks = () => closeAllOpenedLinks();

  function closeAllOpenedLinks() {
    for (var idx in window.SII_LEGACY.openedLinks) {
      var win = window.SII_LEGACY.openedLinks[idx];
      win.close();
    }
  }

  function openLink(URL, windowName, companyId) {
    if (target.indexOf('?') < 0) {
      target += '?';
    }
    target += '&WebCacheLocalId=' + eval('(new Date().getTime())');
    target += '&sii_cod_soc=' + companyId;
    var win = window.open(URL, windowName, 'target=' + windowName + ',
    width=400,height=400,resizable=0,scrollbars=1,status=1,toolbar=0,menubar=0');
    window.SII_LEGACY.openLinks.push(win)
    return win;
  }


})(window, document);
*/
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2lpTGlua01hbmFnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9zaWktdG9vbGtpdC9zcmMvbGliL2NvbXBvbmVudHMvbWVudS91dGlscy9TaWlMaW5rTWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSx1REFBdUQ7QUFDdkQsTUFBTSxPQUFPLGNBQWM7SUFBM0I7UUFFVSxnQkFBVyxHQUFhLEVBQUUsQ0FBQztJQTBDckMsQ0FBQztJQXhDQyxRQUFRLENBQUMsU0FBdUIsRUFBQyxnQkFBd0IsRUFBRyxTQUFrQjtRQUM1RSxJQUFJLFNBQVMsR0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDO1FBQzdCLE1BQU0sWUFBWSxHQUFDLGdCQUFnQixDQUFBLENBQUMsQ0FBQSxPQUFPLENBQUEsQ0FBQyxDQUFBLE9BQU8sQ0FBQztRQUNwRCxNQUFNLFFBQVEsR0FBQyxVQUFVLFlBQVksNkVBQTZFLENBQUM7UUFDbkgsSUFBSSxTQUFTLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO1lBQy9CLFNBQVMsSUFBSSxHQUFHLENBQUM7UUFDbkIsQ0FBQztRQUNELFNBQVMsSUFBSSxtQkFBbUIsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ25FLElBQUksU0FBUyxFQUFFLENBQUM7WUFDZCxTQUFTLElBQUksYUFBYSxHQUFHLFNBQVMsQ0FBQztRQUN6QyxDQUFDO1FBQ0QscUhBQXFIO1FBQ3JILHlGQUF5RjtRQUN6RixNQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUNyQixTQUFTLEVBQ1QsZ0JBQWdCLENBQUEsQ0FBQyxDQUFBLE9BQU8sQ0FBQSxDQUFDLENBQUEsR0FBRyxTQUFTLENBQUMsS0FBSyxHQUFHLENBQUMsS0FBSyxHQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUN0RSxRQUFRLENBQ1IsQ0FBQztRQUdGLElBQUcsQ0FBQyxnQkFBZ0IsRUFBQyxDQUFDO1lBQ3BCLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsR0FBRSxFQUFFO2dCQUNqQyxJQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBRyxDQUFDLENBQUMsRUFBQyxDQUFDO29CQUN4RCxPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUM7b0JBQ2hDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztvQkFDWixNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUMzQixDQUFDO1lBQ0QsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ1osQ0FBQztRQUdILElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzNCLE9BQU8sR0FBRyxDQUFDO0lBQ2IsQ0FBQztJQUVELG1CQUFtQjtRQUNqQixLQUFLLE1BQU0sR0FBRyxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUNuQyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDZCxDQUFDO0lBQ0gsQ0FBQztDQUNGO0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUE0QkUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTaWlNZW51Vm9pY2UgfSBmcm9tICcuLi9nbG9iYWwtbWVudS9kdG8vbWVudS12b2ljZSc7XHJcblxyXG4vLyBoZXJlIGlzIHRoZSBjb2RlIHRoYXQgZGVhbHMgd2l0aCB0aGUgbGVnYWN5IHN5c3RlbXMuXHJcbmV4cG9ydCBjbGFzcyBTSUlMaW5rTWFuYWdlciB7XHJcblxyXG4gIHByaXZhdGUgb3BlbmVkTGlua3M6IFdpbmRvd1tdID0gW107XHJcblxyXG4gIG9wZW5MaW5rKG1lbnVWb2ljZTogU2lpTWVudVZvaWNlLG9wZW5JblRoaXNXaW5kb3c6Ym9vbGVhbiwgIGNvbXBhbnlJZD86IHN0cmluZykge1xyXG4gICAgbGV0IHVybFRvQ2FsbD1tZW51Vm9pY2UubGluaztcclxuICAgIGNvbnN0IHdpbmRvd1RhcmdldD1vcGVuSW5UaGlzV2luZG93Pydfc2VsZic6J2JsYW5rJztcclxuICAgIGNvbnN0IGZlYXR1cmVzPWB0YXJnZXQ9JHt3aW5kb3dUYXJnZXR9LHdpZHRoPTQwMCxoZWlnaHQ9NDAwLHJlc2l6YWJsZT0wLHNjcm9sbGJhcnM9MSxzdGF0dXM9MSx0b29sYmFyPTAsbWVudWJhcj0wYDtcclxuICAgIGlmICh1cmxUb0NhbGwuaW5kZXhPZignPycpIDwgMCkge1xyXG4gICAgICB1cmxUb0NhbGwgKz0gJz8nO1xyXG4gICAgfVxyXG4gICAgdXJsVG9DYWxsICs9ICcmV2ViQ2FjaGVMb2NhbElkPScgKyBuZXcgRGF0ZSgpLmdldFRpbWUoKS50b1N0cmluZygpO1xyXG4gICAgaWYgKGNvbXBhbnlJZCkge1xyXG4gICAgICB1cmxUb0NhbGwgKz0gJyZzb2Njb2RpY2U9JyArIGNvbXBhbnlJZDtcclxuICAgIH1cclxuICAgIC8vIHRoZSAywrBwYXJhbWV0ZXIgaXMgdGhlIG5hbWUgb2YgdGhlIG9wZW5lZCB3aW5kb3cuIGlmIGEgd2luZG93IHdpdGggdGhlIHNhbWUgbmFtZSBpcyBvcGVuZWQsIHRoZSBzYW1lIHdpZG93IGlzIHVzZWRcclxuICAgIC8vIGlmIGFkZCB0aGUgM8KwcGFyYW1ldGVyIGZlYXR1cmVzICwgdGhlIG5ldyBsaW5rIGlzIG9wZW5lZCBpbiBhIG5ldyB3aW5kb3cgaW50ZWFkIG9mIHRhYlxyXG4gICAgY29uc3Qgd2luID0gd2luZG93Lm9wZW4oXHJcbiAgICAgIHVybFRvQ2FsbCxcclxuICAgICAgb3BlbkluVGhpc1dpbmRvdz8nX3NlbGYnOmAke21lbnVWb2ljZS50aXRsZX0keygnIC0gJytjb21wYW55SWQpIHx8ICcnfWBcclxuICAgICAgLGZlYXR1cmVzXHJcbiAgICAgICk7XHJcblxyXG5cclxuICAgICAgaWYoIW9wZW5JblRoaXNXaW5kb3cpe1xyXG4gICAgICAgIHdpbi5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCk9PntcclxuICAgICAgICBpZih3aW4ubG9jYXRpb24uaHJlZi50b0xvd2VyQ2FzZSgpLmluZGV4T2YoJ2xvZ2luJykhPT0tMSl7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnc2Vzc2lvbmUgc2NhZHV0YScpO1xyXG4gICAgICAgICAgd2luLmNsb3NlKCk7XHJcbiAgICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIH0sIGZhbHNlKTtcclxuICAgICAgfVxyXG5cclxuXHJcbiAgICB0aGlzLm9wZW5lZExpbmtzLnB1c2god2luKTtcclxuICAgIHJldHVybiB3aW47XHJcbiAgfVxyXG5cclxuICBjbG9zZUFsbE9wZW5lZExpbmtzKCkge1xyXG4gICAgZm9yIChjb25zdCB3aW4gb2YgdGhpcy5vcGVuZWRMaW5rcykge1xyXG4gICAgICB3aW4uY2xvc2UoKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbi8qXHJcbndpbmRvdy5TSUlfTEVHQUNZID0ge307XHJcbihmdW5jdGlvbiAod2luZG93LCBkb2N1bWVudCwgdW5kZWZpbmVkKSB7XHJcbiAgd2luZG93LlNJSV9MRUdBQ1kub3BlbmVkTGlua3MgPSBbXTtcclxuICB3aW5kb3cuU0lJX0xFR0FDWS5vcGVuTGlua0luTmV3V0luZG93ID0gKFVSTCxjb21wYW55SWQpID0+IG9wZW5MaW5rKFVSTCxjb21wYW55SWQsICdfYmxhbmsnKTtcclxuICB3aW5kb3cuU0lJX0xFR0FDWS5jbG9zZUFsbE9wZW5lZExpbmtzID0gKCkgPT4gY2xvc2VBbGxPcGVuZWRMaW5rcygpO1xyXG5cclxuICBmdW5jdGlvbiBjbG9zZUFsbE9wZW5lZExpbmtzKCkge1xyXG4gICAgZm9yICh2YXIgaWR4IGluIHdpbmRvdy5TSUlfTEVHQUNZLm9wZW5lZExpbmtzKSB7XHJcbiAgICAgIHZhciB3aW4gPSB3aW5kb3cuU0lJX0xFR0FDWS5vcGVuZWRMaW5rc1tpZHhdO1xyXG4gICAgICB3aW4uY2xvc2UoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIG9wZW5MaW5rKFVSTCwgd2luZG93TmFtZSwgY29tcGFueUlkKSB7XHJcbiAgICBpZiAodGFyZ2V0LmluZGV4T2YoJz8nKSA8IDApIHtcclxuICAgICAgdGFyZ2V0ICs9ICc/JztcclxuICAgIH1cclxuICAgIHRhcmdldCArPSAnJldlYkNhY2hlTG9jYWxJZD0nICsgZXZhbCgnKG5ldyBEYXRlKCkuZ2V0VGltZSgpKScpO1xyXG4gICAgdGFyZ2V0ICs9ICcmc2lpX2NvZF9zb2M9JyArIGNvbXBhbnlJZDtcclxuICAgIHZhciB3aW4gPSB3aW5kb3cub3BlbihVUkwsIHdpbmRvd05hbWUsICd0YXJnZXQ9JyArIHdpbmRvd05hbWUgKyAnLFxyXG4gICAgd2lkdGg9NDAwLGhlaWdodD00MDAscmVzaXphYmxlPTAsc2Nyb2xsYmFycz0xLHN0YXR1cz0xLHRvb2xiYXI9MCxtZW51YmFyPTAnKTtcclxuICAgIHdpbmRvdy5TSUlfTEVHQUNZLm9wZW5MaW5rcy5wdXNoKHdpbilcclxuICAgIHJldHVybiB3aW47XHJcbiAgfVxyXG5cclxuXHJcbn0pKHdpbmRvdywgZG9jdW1lbnQpO1xyXG4qL1xyXG4iXX0=
<div style="background: #FFD900;height: 3px; top: 0;"></div>
<div style="font-family: arial, sans-serif; font-size: 16px; line-height: 20px; border: 1px solid #D7D7D7; border-top: none; padding: 25px;"><img src="https://p0.ipstatp.com/large/0059cc6e9cdec0abc389" style="width: 36%;">
  <p style="line-height: 2">{{header}} {{name}},</p>
  {% for item in content %}
    {% if item.startsWith("-") %}
        <div>{{item}}</div>
    {% else %}
        <p>{{item}}</p>
    {% endif %}
  {% endfor %}
  <div style="font-weight: bold; border-left: none; border-right: none; text-align:left;"><a href="{{link}}" style="display:inline-block; padding: 0 14px; text-decoration: none; line-height: 30px; height: 30px; background-color: #4886FF; border-radius: 2px;color: #fff; font-size: 14px;">{{link_text}}</a></div>
  <div>
    <p>{{url_invalid_text}}</p><a href="{{link}}" style="word-break: break-all;">{{link}}</a>
  </div>
  <div style="margin-top: 20px">{{team}}</div>
  <div style="margin-top: 20px"></div>{% for index in footer %}
  <div style="">{{index}}</div>{% endfor %}
  <div style="text-align: left; margin: 20px 0;"> 
    <div style="border-bottom: 1px solid #D7D7D7;padding-bottom: 10px">{{invite[1]}}<a href="mailto: {{email}}}">{{email}}</a></div>
    <div style="margin-top: 20px"><a href="{{facebook_url}}"><img src="http://s0.ipstatp.com/img/ic_facebook.png" style="margin-right: 16px"></a><a href="{{twitter_url}}"><img src="http://s0.ipstatp.com/img/ic_tw.png" style="margin-right: 16px"></a><a href="{{youtube_url}}"><img src="http://s0.ipstatp.com/img/ic_youtube.png"></a></div>
  </div>
  <div style="margin-top: 20px; font-size: 14px"><span><a href="{{unsubscribe_url}}">Unsubscribe</a></span><span style="margin: 0 10px">|</span><span><a href="{{faq_url}}">FAQ</a></span><span style="margin: 0 10px">|</span><span><a href="{{about_url}}">About</a></span><span style="margin: 0 10px">|</span><span><a href="{{terms_url}}">Terms</a></span>
    <div style="padding-bottom: 10px">{{address}}</div>
  </div>
  <div style="border-top: 1px solid #D7D7D7; padding: 20px 0"><a href="{{download_ios_url}}"><img src="http://s0.ipstatp.com/img/AppleStore@1x.png" width="125" height="48" alt="" style="margin-right: 10px; margin-top: 14px"></a><a href="{{download_android_url}}"><img src="http://s0.ipstatp.com/img/GooglePlay@1x.png" width="125" height="48" alt="" style="margin-top: 14px"></a></div>
</div>
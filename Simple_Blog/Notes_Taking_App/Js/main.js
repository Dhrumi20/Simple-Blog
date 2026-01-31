    var postTitle = document.getElementById("postTitle");
    var postContent = document.getElementById("postContent");
    var addPostBtn = document.getElementById("addPostBtn");
    var postsWrap = document.getElementById("postsWrap");
    var searchBox = document.getElementById("searchBox");
    var clearAllBtn = document.getElementById("clearAllBtn");

    var postsList = [];
    var STORAGE_KEY = "bw_simple_blog_v1";

    function loadPosts(){
      var saved = localStorage.getItem(STORAGE_KEY);
      if(saved){
        try{
          postsList = JSON.parse(saved) || [];
        }catch(err){
          postsList = [];
        }
      }else{
        postsList = [];
      }
      renderPosts("");
    }

    function savePosts(){
      localStorage.setItem(STORAGE_KEY, JSON.stringify(postsList));
    }

    function escapeHtml(str){
      return str
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
    }

    function formatTime(dateStr){
      var d = new Date(dateStr);
      return d.toLocaleString();
    }

    function renderPosts(filterText){
      postsWrap.innerHTML = "";

      var listToShow = postsList;

      if(filterText && filterText.trim() !== ""){
        var ft = filterText.toLowerCase();
        listToShow = postsList.filter(function(p){
          return (
            p.title.toLowerCase().includes(ft) ||
            p.content.toLowerCase().includes(ft)
          );
        });
      }

      if(listToShow.length === 0){
        postsWrap.innerHTML = `
          <div class="empty">
            No posts yet 😌<br/><br/>
            Write your first blog post ✨
          </div>
        `;
        return;
      }

      listToShow.forEach(function(post){
        var div = document.createElement("div");
        div.className = "post";

        div.innerHTML = `
          <div class="time">🕒 ${formatTime(post.time)}</div>
          <h3>${escapeHtml(post.title)}</h3>
          <div class="text">${escapeHtml(post.content)}</div>
          <div class="actions">
            <button class="editBtn" data-id="${post.id}">Edit</button>
            <button class="deleteBtn" data-id="${post.id}">Delete</button>
          </div>
        `;

        postsWrap.appendChild(div);
      });

      document.querySelectorAll(".editBtn").forEach(function(btn){
        btn.addEventListener("click", function(){
          var id = btn.getAttribute("data-id");
          editPost(id);
        });
      });

      document.querySelectorAll(".deleteBtn").forEach(function(btn){
        btn.addEventListener("click", function(){
          var id = btn.getAttribute("data-id");
          deletePost(id);
        });
      });
    }

    function addPost(){
      var title = postTitle.value.trim();
      var content = postContent.value.trim();

      if(title === ""){
        alert("Title blank nahi chalega bro 😭");
        return;
      }

      if(content === ""){
        alert("Content blank nahi chalega bro 😭");
        return;
      }

      var newPost = {
        id: Date.now().toString(),
        title: title,
        content: content,
        time: new Date().toISOString()
      };

      // newest on top
      postsList.unshift(newPost);

      savePosts();
      postTitle.value = "";
      postContent.value = "";
      renderPosts(searchBox.value);
    }

    function deletePost(id){
      var ok = confirm("Delete this post? 🗑️");
      if(!ok) return;

      postsList = postsList.filter(function(p){
        return p.id !== id;
      });

      savePosts();
      renderPosts(searchBox.value);
    }

    function editPost(id){
      var post = postsList.find(function(p){
        return p.id === id;
      });

      if(!post) return;

      var updatedTitle = prompt("Edit title ✏️", post.title);
      if(updatedTitle === null) return;
      updatedTitle = updatedTitle.trim();

      if(updatedTitle === ""){
        alert("Title empty nahi rakhay 😶");
        return;
      }

      var updatedContent = prompt("Edit content ✏️", post.content);
      if(updatedContent === null) return;
      updatedContent = updatedContent.trim();

      if(updatedContent === ""){
        alert("Content empty nahi rakhay 😶");
        return;
      }

      post.title = updatedTitle;
      post.content = updatedContent;
      post.time = new Date().toISOString();

      savePosts();
      renderPosts(searchBox.value);
    }

    function clearAll(){
      if(postsList.length === 0){
        alert("Already empty 😌");
        return;
      }

      var ok = confirm("Clear ALL posts? This can’t be undone ⚠️");
      if(!ok) return;

      postsList = [];
      savePosts();
      searchBox.value = "";
      renderPosts("");
    }

    addPostBtn.addEventListener("click", addPost);

    searchBox.addEventListener("input", function(){
      renderPosts(searchBox.value);
    });

    clearAllBtn.addEventListener("click", clearAll);

    // shortcut: Ctrl + Enter to publish
    postContent.addEventListener("keydown", function(e){
      if(e.ctrlKey && e.key === "Enter"){
        addPost();
      }
    });

    loadPosts();

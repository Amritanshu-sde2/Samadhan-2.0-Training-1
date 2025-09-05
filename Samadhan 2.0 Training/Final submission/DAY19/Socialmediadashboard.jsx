import React, { useEffect, useMemo, useState } from "react";


// ---------- Utilities ----------
const uid = () => Math.random().toString(36).slice(2, 10);
const nowISO = () => new Date().toISOString();

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return ${sec}s ago;
  const min = Math.floor(sec / 60);
  if (min < 60) return ${min}m ago;
  const hr = Math.floor(min / 60);
  if (hr < 24) return ${hr}h ago;
  const d = Math.floor(hr / 24);
  return ${d}d ago;
}

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// ---------- Local Storage Layer ----------
const STORAGE_KEY = "day19_social_data_v1";
const loadStore = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (_) {
    return null;
  }
};
const saveStore = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (_) {}
};

// ---------- Mock Avatars ----------
function Avatar({ name, size = 40 }) {
  const initials = (name || "?")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div
      className="flex items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 text-white"
      style={{ width: size, height: size, fontSize: size / 2.6, fontWeight: 700 }}
      aria-label={${name} avatar}
    >
      {initials}
    </div>
  );
}

// ---------- Seed Data ----------
const seed = () => {
  const userA = {
    id: uid(),
    name: "Alex Carter",
    handle: "alex",
    bio: "Building cool UIs & sipping coffee.",
    followers: 128,
    following: 212,
  };
  const userB = {
    id: uid(),
    name: "Maya Singh",
    handle: "maya",
    bio: "Traveler • Reader • Dev",
    followers: 392,
    following: 181,
  };
  const userC = {
    id: uid(),
    name: "Jin Park",
    handle: "jin",
    bio: "Design + Code ✨",
    followers: 250,
    following: 300,
  };

  const posts = [
    {
      id: uid(),
      authorId: userB.id,
      text: "Just finished a 5k run! 🏃‍♀ Feeling energized.",
      image: "",
      createdAt: nowISO(),
      likes: [userA.id],
      comments: [
        {
          id: uid(),
          authorId: userA.id,
          text: "Congrats! That's awesome",
          createdAt: nowISO(),
        },
      ],
    },
    {
      id: uid(),
      authorId: userA.id,
      text: "Prototyping a social dashboard in React. What features would you add?",
      image: "",
      createdAt: nowISO(),
      likes: [userB.id, userC.id],
      comments: [],
    },
  ];

  return {
    users: { [userA.id]: userA, [userB.id]: userB, [userC.id]: userC },
    currentUserId: userA.id,
    posts,
  };
};

// ---------- Store Hook ----------
function useSocialStore() {
  const [state, setState] = useState(() => loadStore() || seed());
  useEffect(() => saveStore(state), [state]);

  // Derived selectors
  const currentUser = useMemo(() => state.users[state.currentUserId], [state]);

  // Actions
  const editProfile = (partial) =>
    setState((s) => ({
      ...s,
      users: { ...s.users, [s.currentUserId]: { ...s.users[s.currentUserId], ...partial } },
    }));

  const createPost = ({ text, image }) =>
    setState((s) => ({
      ...s,
      posts: [
        {
          id: uid(),
          authorId: s.currentUserId,
          text: text.trim(),
          image: image?.trim?.() || "",
          createdAt: nowISO(),
          likes: [],
          comments: [],
        },
        ...s.posts,
      ],
    }));

  const toggleLike = (postId) =>
    setState((s) => {
      const posts = s.posts.map((p) => {
        if (p.id !== postId) return p;
        const has = p.likes.includes(s.currentUserId);
        return { ...p, likes: has ? p.likes.filter((id) => id !== s.currentUserId) : [...p.likes, s.currentUserId] };
      });
      return { ...s, posts };
    });

  const addComment = (postId, text) =>
    setState((s) => {
      const posts = s.posts.map((p) => {
        if (p.id !== postId) return p;
        const comment = { id: uid(), authorId: s.currentUserId, text: text.trim(), createdAt: nowISO() };
        return { ...p, comments: [...p.comments, comment] };
      });
      return { ...s, posts };
    });

  const deletePost = (postId) =>
    setState((s) => ({ ...s, posts: s.posts.filter((p) => p.id !== postId || p.authorId !== s.currentUserId ? p : false) }));

  const deleteComment = (postId, commentId) =>
    setState((s) => {
      const posts = s.posts.map((p) => {
        if (p.id !== postId) return p;
        return { ...p, comments: p.comments.filter((c) => !(c.id === commentId && c.authorId === s.currentUserId)) };
      });
      return { ...s, posts };
    });

  return { state, setState, currentUser, editProfile, createPost, toggleLike, addComment, deletePost, deleteComment };
}

// ---------- UI Components ----------
function Shell({ children }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-10 backdrop-blur bg-white/80 border-b">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500" />
          <h1 className="text-xl font-bold">Day 19 — Social Media Dashboard</h1>
          <div className="ml-auto text-sm text-slate-500">Frontend-only • LocalStorage</div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6 grid grid-cols-1 md:grid-cols-12 gap-6">{children}</main>
    </div>
  );
}

function Card({ className, children }) {
  return <div className={cn("bg-white rounded-2xl shadow-sm border p-4", className)}>{children}</div>;
}

function ProfileCard({ user, onEdit }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ name: user.name, handle: user.handle, bio: user.bio });
  useEffect(() => setDraft({ name: user.name, handle: user.handle, bio: user.bio }), [user]);

  const save = () => {
    onEdit(draft);
    setEditing(false);
  };

  return (
    <Card className="md:col-span-3 h-fit">
      <div className="flex items-start gap-3">
        <Avatar name={user.name} size={56} />
        <div className="flex-1">
          {!editing ? (
            <>
              <div className="font-semibold leading-tight">{user.name}</div>
              <div className="text-sm text-slate-500">@{user.handle}</div>
            </>
          ) : (
            <div className="space-y-2">
              <input
                className="w-full border rounded-xl px-3 py-2 text-sm"
                value={draft.name}
                onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                placeholder="Name"
              />
              <input
                className="w-full border rounded-xl px-3 py-2 text-sm"
                value={draft.handle}
                onChange={(e) => setDraft((d) => ({ ...d, handle: e.target.value.replace(/\s+/g, "") }))}
                placeholder="Handle"
              />
            </div>
          )}
        </div>
      </div>

      {!editing ? (
        <p className="mt-3 text-sm text-slate-700">{user.bio}</p>
      ) : (
        <textarea
          className="mt-3 w-full border rounded-xl px-3 py-2 text-sm"
          rows={3}
          value={draft.bio}
          onChange={(e) => setDraft((d) => ({ ...d, bio: e.target.value }))}
          placeholder="Bio"
        />
      )}

      <div className="mt-4 flex items-center gap-4 text-sm">
        <div>
          <span className="font-semibold">{user.followers}</span> Followers
        </div>
        <div>
          <span className="font-semibold">{user.following}</span> Following
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        {!editing ? (
          <>
            <button className="px-3 py-2 rounded-xl bg-slate-900 text-white text-sm" onClick={() => setEditing(true)}>
              Edit Profile
            </button>
          </>
        ) : (
          <>
            <button className="px-3 py-2 rounded-xl bg-slate-900 text-white text-sm" onClick={save}>
              Save
            </button>
            <button className="px-3 py-2 rounded-xl border text-sm" onClick={() => setEditing(false)}>
              Cancel
            </button>
          </>
        )}
      </div>
    </Card>
  );
}

function Composer({ onPost }) {
  const [text, setText] = useState("");
  const [image, setImage] = useState("");
  const canPost = text.trim().length > 0 || image.trim().length > 0;

  const submit = () => {
    if (!canPost) return;
    onPost({ text, image });
    setText("");
    setImage("");
  };

  return (
    <Card className="md:col-span-6">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <textarea
            className="w-full border rounded-2xl px-4 py-3 text-sm"
            rows={3}
            placeholder="What's happening?"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            className="mt-2 w-full border rounded-2xl px-4 py-2 text-sm"
            placeholder="Optional image URL"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        </div>
      </div>
      <div className="mt-3 flex items-center justify-end">
        <button
          className={cn(
            "px-4 py-2 rounded-xl text-sm transition",
            canPost ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-500 cursor-not-allowed"
          )}
          onClick={submit}
          disabled={!canPost}
        >
          Post
        </button>
      </div>
    </Card>
  );
}

function PostCard({ post, author, currentUser, onLike, onComment, onDeletePost, onDeleteComment }) {
  const [showComments, setShowComments] = useState(true);
  const [text, setText] = useState("");
  const liked = post.likes.includes(currentUser.id);
  const canDeletePost = post.authorId === currentUser.id;

  const submitComment = () => {
    if (!text.trim()) return;
    onComment(post.id, text);
    setText("");
    setShowComments(true);
  };

  return (
    <Card className="md:col-span-6">
      <div className="flex gap-3">
        <Avatar name={author.name} />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className="font-semibold leading-tight">{author.name}</div>
            <div className="text-sm text-slate-500">@{author.handle} · {timeAgo(post.createdAt)}</div>
            <div className="ml-auto flex items-center gap-2">
              <button
                className={cn(
                  "px-2 py-1 rounded-lg text-xs border",
                  liked ? "bg-indigo-600 text-white border-indigo-600" : "bg-white"
                )}
                onClick={() => onLike(post.id)}
                aria-pressed={liked}
              >
                {liked ? "♥ Liked" : "♡ Like"} ({post.likes.length})
              </button>
              {canDeletePost && (
                <button className="px-2 py-1 rounded-lg text-xs border" onClick={() => onDeletePost(post.id)}>
                  Delete
                </button>
              )}
            </div>
          </div>
          {post.text && <p className="mt-2 text-sm whitespace-pre-wrap">{post.text}</p>}
          {post.image && (
            <div className="mt-3 overflow-hidden rounded-2xl border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.image} alt="Post" className="w-full object-cover max-h-96" />
            </div>
          )}

          {/* Comment composer */}
          <div className="mt-3">
            <div className="flex gap-2">
              <input
                className="flex-1 border rounded-xl px-3 py-2 text-sm"
                placeholder="Write a comment…"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submitComment()}
              />
              <button className="px-3 py-2 rounded-xl bg-slate-900 text-white text-sm" onClick={submitComment}>
                Comment
              </button>
            </div>
          </div>

          {/* Comments */}
          <button
            className="mt-3 text-xs text-slate-500 hover:underline"
            onClick={() => setShowComments((v) => !v)}
          >
            {showComments ? "Hide" : "Show"} comments ({post.comments.length})
          </button>

          {showComments && (
            <div className="mt-2 space-y-3">
              {post.comments.length === 0 && (
                <div className="text-sm text-slate-500">No comments yet. Be the first to comment!</div>
              )}
              {post.comments.map((c) => (
                <div key={c.id} className="flex gap-2">
                  <Avatar name={(author && author.name) || "User"} size={28} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium">
                        {/* Find comment author name via prop if available */}
                        {/* Fallback displayed below via resolver in Feed */}
                        <CommentAuthor id={c.authorId} />
                      </div>
                      <div className="text-xs text-slate-500">{timeAgo(c.createdAt)}</div>
                      {c.authorId === currentUser.id && (
                        <button
                          className="ml-auto text-xs text-rose-600 hover:underline"
                          onClick={() => onDeleteComment(post.id, c.id)}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                    <div className="text-sm">{c.text}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

function CommentAuthor({ id }) {
  const { state } = useSocialStoreContext();
  const name = state.users[id]?.name || "User";
  const handle = state.users[id]?.handle || "user";
  return (
    <span>
      {name} <span className="text-xs text-slate-500">@{handle}</span>
    </span>
  );
}

function Suggestions({ users, currentUserId }) {
  const others = Object.values(users).filter((u) => u.id !== currentUserId).slice(0, 5);
  return (
    <Card className="md:col-span-3 h-fit">
      <div className="font-semibold">Who to follow</div>
      <div className="mt-3 space-y-3">
        {others.map((u) => (
          <div key={u.id} className="flex items-center gap-3">
            <Avatar name={u.name} size={36} />
            <div className="flex-1">
              <div className="text-sm font-medium leading-tight">{u.name}</div>
              <div className="text-xs text-slate-500">@{u.handle}</div>
            </div>
            <button className="px-3 py-1.5 rounded-xl border text-xs">Follow</button>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ---------- Context for cross-component read-only access ----------
const SocialStoreContext = React.createContext(null);
function useSocialStoreContext() {
  const ctx = React.useContext(SocialStoreContext);
  if (!ctx) throw new Error("useSocialStoreContext must be used within Provider");
  return ctx;
}

function Feed() {
  const { state, currentUser, toggleLike, addComment, deletePost, deleteComment } = useSocialStoreContext();
  return (
    <div className="md:col-span-6 space-y-4">
      {state.posts.length === 0 && <Card>No posts yet. Say hello! 👋</Card>}
      {state.posts.map((p) => (
        <PostCard
          key={p.id}
          post={p}
          author={state.users[p.authorId]}
          currentUser={currentUser}
          onLike={toggleLike}
          onComment={addComment}
          onDeletePost={deletePost}
          onDeleteComment={deleteComment}
        />
      ))}
    </div>
  );
}

function HeaderStats() {
  const { state } = useSocialStoreContext();
  return (
    <div className="md:col-span-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card>
        <div className="text-xs text-slate-500">Users</div>
        <div className="text-2xl font-bold">{Object.keys(state.users).length}</div>
      </Card>
      <Card>
        <div className="text-xs text-slate-500">Posts</div>
        <div className="text-2xl font-bold">{state.posts.length}</div>
      </Card>
      <Card>
        <div className="text-xs text-slate-500">Total Likes</div>
        <div className="text-2xl font-bold">{state.posts.reduce((n, p) => n + p.likes.length, 0)}</div>
      </Card>
    </div>
  );
}

export default function App() {
  const store = useSocialStore();
  const { currentUser, editProfile, createPost } = store;

  return (
    <SocialStoreContext.Provider value={store}>
      <Shell>
        <HeaderStats />
        <ProfileCard user={currentUser} onEdit={editProfile} />
        <Composer onPost={createPost} />
        <Feed />
        <Suggestions users={store.state.users} currentUserId={store.state.currentUserId} />
      </Shell>
    </SocialStoreContext.Provider>
  );
}

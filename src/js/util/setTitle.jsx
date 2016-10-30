const windowTitle = document.title || 'OAuth2Cloud';

export default function setTitle(title = null) {
  if (!title) {
    document.title = windowTitle;
  } else {
    document.title = `${title} | ${windowTitle}`;
  }
}
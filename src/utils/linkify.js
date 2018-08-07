import a from 'anchorme'
import unescapeHTML from './unescapeHTML'

export default function linkify (str='') {
  const opts = {
    truncate: 25,
    emails: false,
    ips: false,
    files: false,
    attributes: [
      { name: 'target', value: '_blank' },
      { name: 'rel', value: 'noopener noreferrer nofollow' }
    ]
  }
  return a(unescapeHTML(str), opts)
}

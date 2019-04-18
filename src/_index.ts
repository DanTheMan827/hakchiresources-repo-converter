#!/usr/bin/env node

import * as request from 'request-promise-native'
import * as tar from 'tar-stream'
import * as zlib from 'zlib'
import * as fs from 'fs'

import { Posts, ModType } from "./Post"

const entitiesBase = require('html-entities').XmlEntities
const entities = new entitiesBase()
const titleCase = require('title-case')
const gzip = zlib.createGzip()
const jsonUrl = "https://hakchiresources.com/api/get_posts/?count=10000"

function packPromise(pack: tar.Pack, headers: tar.Headers, data: string | Buffer) {
  return new Promise((resolve, reject) => {
    const entry = pack.entry(headers, data, (err) => {
      if (err) {
        reject(err)
      }
    })
    entry.end(resolve)
  })
}

async function Main() {
  const json: Posts = JSON.parse(await request.get(jsonUrl))

  const pack = tar.pack()
  const list = []
  for (let i = 0; i < json.posts.length; i++) {
    const post = json.posts[i]
    console.log(`${post.title}\n  ${post.slug}`)
    let modType: ModType | null = ModType.Hmod
    let raTag: string | null = null

    post.tags.forEach(tag => {

      if (tag.slug === "non_hmod") {
        if (modType !== ModType.Game) {
          modType = null
          console.log("  non_hmod")
        }
      }

      if (tag.slug === "game") {
        modType = ModType.Game
        console.log("  game")
      }

      if (tag.slug.startsWith("ra_")) {
        raTag = titleCase(tag.slug.substr(3).replace(/_/g, " "))
      }
    })

    if (modType === null) {
      continue
    }

    console.log("")

    const name = entities.decode(post.title)
    const id = post.title
    const author = post.custom_fields.user_submit_name && post.custom_fields.user_submit_name[0]
    const description = post.content
    const content = post.content
    const version = post.custom_fields.usp_custom_field && post.custom_fields.usp_custom_field[0]
    const path = post.custom_fields.user_submit_url && post.custom_fields.user_submit_url[0]
    const modRepoName = `${post.slug}${modType === null ? "" : (modType as ModType).toString()}`

    if (path == null || (modType === ModType.Hmod && !path.endsWith(".hmod"))) {
      continue
    }

    const readmeMetaLines: string[] = [
      `Name: ${name}`,
      `Creator: ${author}`,
      `Category: ${raTag === null ? post.categories[0].title : "Retroarch Cores"}`
    ]

    if (version !== "") {
      readmeMetaLines.push(`Version: ${version}`)
    }

    if (raTag !== null) {
      readmeMetaLines.push(`Emulated System: ${raTag}`)

    }

    const readme = `---\n${readmeMetaLines.join("\n")}\n---\n${post.content}`

    await packPromise(pack, { name: `${modRepoName}/readme.md` }, readme)
    await packPromise(pack, { name: `${modRepoName}/link` }, path)

    list.push(modRepoName)
  }

  await packPromise(pack, { name: "list" }, list.join("\n"))

  if (fs.existsSync("welcome.md")) {
    await packPromise(pack, { name: "readme.md" }, fs.readFileSync("welcome.md"))
  }

  pack.finalize()

  const out = fs.createWriteStream("pack.tgz")
  pack.pipe(gzip).pipe(out)
}

Main()

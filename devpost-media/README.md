# QuietNeeds Devpost submission kit

Updated November 27, 2026 IST. The hosted demo is live and the public repository has a GitHub-detected MIT license. The Devpost copy, four gallery images, and local 2:45 MP4 are ready. The public YouTube URL and the signed-in production walkthrough remain open.

The submission deadline is **December 1, 2026 at 3:30 a.m. IST** (**November 30 at 2:00 p.m. PST**). Judging ends December 16 at 2:00 p.m. PST. Use the permanent live URL for judging. [Official rules](https://firebasehybridaihackathon.devpost.com/rules)

## Devpost fields

| Field | Entry |
| --- | --- |
| Project name | QuietNeeds |
| Project start date | `11-15-26` |
| Platform | Web (Chrome) |
| Working demo | https://quietneeds-web.web.app/ |
| Try it out — source code | https://github.com/chitrakumarsai/quiet-needs |
| Open-source license | https://github.com/chitrakumarsai/quiet-needs/blob/main/LICENSE |
| Public YouTube demo | URL pending |

For **Try it out**, add the live demo and the source repository as separate links. For **Built with**, use TypeScript, React, Rsbuild, Firebase, Firebase Hosting, Firebase Authentication, Cloud Firestore, Firebase AI Logic, Firebase App Check, reCAPTCHA Enterprise, Google Gemini, Gemini Nano 4, and Service Workers.

## About the project

Copy the seven sections below into the About the project field.

```markdown
## Inspiration

“I need a seated option for the photo walk” gives an organizer something they can act on. The reason someone needs it can stay private. But sending the request is only half the job. Before deciding whether to attend, that person still needs to know whether a seated option will actually be available.

We built QuietNeeds to give participants a way to ask for what they need and see what the organizer can provide before the event.

## What it does

Participants write practical requests, review exactly what their participation card contains, and approve it before sharing. Organizers can link each request to a planned activity, mark it **Still checking**, or say **Can’t provide**.

A participant might see a seated photo exercise on the published agenda while step-free entry is still being checked. They can respond **Works for me** or **Still need help** to the seated exercise. The entrance request keeps its own status.

## How we built it

We built QuietNeeds with React and TypeScript and deployed it on Firebase Hosting. Firebase Authentication handles sign-in, and Firestore security rules limit access to event data and private request outcomes.

Organizers can plan manually or ask Firebase AI Logic for a cloud proposal. Before generating, they review the approved requests and event facts that will be sent. They decide what to publish, and the app saves the agenda together with the private outcomes.

We also built a Chrome development evaluator that uses Gemini Nano 4 through Firebase AI Logic with on-device execution required. It lets us test drafting with fictional notes. The live participant flow uses manual entry.

## Challenges we ran into

Keeping an answer tied to the right request was harder than displaying it. If someone replaces their card after an agenda is published, a response to the old request can give the wrong impression. We tied feedback to both the approved card revision and the published agenda revision. Replacing a card makes the old agenda stale, and republishing starts with fresh feedback.

Drafting also exposed a subtler problem. In one fictional test, a request for permission to use a loan headset became a suggestion to consider one. The draft sounded plausible, and reviewers missed some changes like this even with the source beside it.

## Accomplishments that we're proud of

We verified the full loop with two accounts and fictional requests. One participant shared a card, the organizer published a planned activity and an unresolved request, and the participant responded to the linked activity. After the participant replaced the card, the organizer republished and confirmed that the old feedback had cleared.

We also verified that participants could write, approve, and download a card offline after loading the app once.

## What we learned

A correctly formatted draft can still lose the detail that makes a request actionable. Our evaluation gave us a concrete reason to keep participant drafting manual in the live app.

We also learned that uncertainty belongs in the published plan. **Still checking** lets an organizer show that they received a request and gives the participant a clear view of what remains unresolved.

## What's next for QuietNeeds

We want to run a small event pilot and measure how many requests receive a clear answer before the event and how many still need a follow-up message. We’ll keep testing on-device drafting with fictional cases, focusing on whether it preserves conditions, locations, and timing well enough for participants to rely on it.
```

## Main technology requirement

QuietNeeds uses Firebase AI Logic on Web (Chrome). In our development evaluator, Gemini Nano 4 turns fictional private notes into draft participation requests. We configured this flow to require on-device execution and verified the SDK reported `ON_DEVICE`. The evaluator has no cloud fallback.

The live app uses Firebase AI Logic for a separate organizer task. After reviewing the approved requests and venue facts that will be sent, an organizer can generate a cloud agenda proposal, edit it, and decide what to publish. Firebase App Check protects the cloud AI requests. The live participant flow uses manual entry. [Local Chrome evaluator guide](https://github.com/chitrakumarsai/quiet-needs/blob/main/evaluation/README.md)

## Testing instructions for judges

Open the live demo in Chrome. You can create, approve, and download a participation card without signing in. For the event walkthrough, use two Google accounts in separate Chrome profiles. Use fictional requests only. [Live demo](https://quietneeds-web.web.app/)

1. **Organizer.** Sign in and choose **Events → Create an event**. Create a fictional photo workshop and copy its invite link.
2. **Participant.** Open the link in the second Chrome profile, sign in, and select **Request to join**. In the organizer profile, choose **Admit participant**. If an update is slow to appear, use **Check event access**.
3. **Participant.** Choose **Prepare and approve your card** and add two requests, “Please provide a seated alternative to the photo walk” and “Please confirm whether the entrance is step-free.” Review **Card preview** beside the editor on desktop or select **Preview** on a narrow screen. Choose **Approve card → Open event to share your card → Share with organizer**.
4. **Organizer.** Under **Plan the agenda**, add a **Seated photo exercise** slot from **10:00 to 10:30** and save. To try AI planning, choose **Preview cloud planning inputs**, review **Exact input sent to the model**, then choose **Generate cloud proposal**. Under **Needs a decision**, link the seating request to the slot and leave step-free entry as **Still checking**. Approve the exact agenda and outcomes, then choose **Publish agenda**.
5. **Participant.** Under **What changed for you**, verify the planned seated activity and the pending entrance request. Choose **Works for me** on the seating request. The organizer can select **Refresh participant feedback** to see the response.

To test **on-device drafting**, set up a dedicated Firebase AI Logic project and App Check using the linked guide. On a compatible desktop Chrome device, clone the public repository, use Node 22.14 or later in the Node 22 series, run `npm ci` and `npm run dev`, then open `http://127.0.0.1:5173/evaluation.html`. Choose **Run 30 synthetic cases on device** and look for `ON_DEVICE` in the results. Keep Firebase debug tokens in your local configuration. [Firebase and Chrome setup](https://github.com/chitrakumarsai/quiet-needs/blob/main/QUIETNEEDS_EXECUTION_PLAN.md#4-firebase-and-browser-setup) · [Evaluator guide](https://github.com/chitrakumarsai/quiet-needs/blob/main/evaluation/README.md)

## Gallery upload order

Each PNG is 1350 × 900 (3:2) and below 5 MB. The images use the app with fictional requests.

1. [Participant outcomes — cover](04-participant-outcomes.png)
2. [QuietNeeds home page](01-quietneeds.png)
3. [Participation card and exact preview](02-participation-card.png)
4. [Organizer decisions and agenda planning](03-organizer-decisions.png)

## Video and final checks

The 2:45 English demo with captions is ready to upload as `quietneeds-demo-2m45s-ai-footage.mp4`. It shows the app using fictional content, a fresh cloud agenda proposal, and a fresh on-device draft from the development evaluator. Upload the MP4 publicly on YouTube and paste its URL into Devpost. [Official video requirements](https://firebasehybridaihackathon.devpost.com/rules)

| Time | Show |
| --- | --- |
| 0:00–0:19 | Welcome viewers and explain the seated photo walk request. |
| 0:19–0:54 | Enter, preview, approve, and share two fictional requests. |
| 0:54–1:32 | Preview exact cloud inputs, generate a proposal, and publish a planned seating outcome and a pending entrance request. |
| 1:32–2:12 | Respond to the seating outcome, refresh organizer feedback, and replace the shared card. |
| 2:12–2:45 | Run a fictional evaluator case in Chrome, show `ON_DEVICE` in the exported result, and give the hosted demo URL. |

- [x] Verify the hosted card and sign-in entry point from a fresh signed-out Chrome context. The approved download matched the fictional request, and reload cleared the draft.
- [ ] Run the complete signed-in walkthrough with two Google accounts on the live domain. The previous hosted walkthrough ran on the identical preview build. The recorded two-role workflow used local Firebase emulators.
- [ ] Rehearse the local Chrome evaluator from a clean checkout and confirm `ON_DEVICE` on a supported device.
- [ ] Verify Firebase AI Logic and App Check remain available through judging. Keep live keys, debug tokens, and real participant data out of submission materials.
- [x] Record the 2:45 video with the working app, two verified AI calls, and English captions.
- [ ] Upload publicly to YouTube, verify playback while signed out, and paste the URL into Devpost.
- [ ] Review the final Devpost preview and submit before the deadline.

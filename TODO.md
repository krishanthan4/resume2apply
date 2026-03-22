# All the features

- login (simple login and registration. no complete stuffs.)
- register

- dashboard
  - create CV
    - > stage 1 - getting CV content
      - get these content to create the CV
        - name\* (which is the main title of the CV)
        - email\* (which used to send emails and contact email for HRs)
        - github link
        - linkedin link
        - personal portfolio website link
        - country in short form (ex: Sri Lanka - SL)

        - experiences[
          {
            company
            job role
            start and end date (Nov 2025 - March 2026)
            currently working (boolean, if selected, set the end date as present)
            [
            bullet points
            ]
          }
          ]

        - projects[
            {
                project name*
                project github link
                project live hosed link
                tech stack
                    [
                        bullet points
                    ]
            }
        ]

        - skills[
            skill category[
                skills
            ] (the user should be able to add skill category or add without skill categories)
        ]

        - education (just 1 education is enough)
            - degree name
            - university name
            - university location (city,country)
            - graduated date (enable or disable)


    - > stage 2 - preview & other details
        - select executive summeries
        - create executive summary templates
    - > stage 3 - features in custom-resume-design
        - which allows to make all the small twiks to the tempalate, edit content, arrange content etc.
            when the user clicks on apply
                - before sending to job-apply
                    - show custom-executive summary to edit completely if needed.
                    - it should show the PDF and ask do you need any extra edit, if not redirect.


  - manage apply
    - kanban board
        add new job application
        delete job applications

    - filter applications
        - filter by applied dates
        - today
        - this week

    - schedule applications
    - immediate apply


  - view scheduled applycations
    - cancel schedules
    - reschedule for particular date & time
  - analytics
  - manage cover letters
  - settings
    - platform settings
        - switch dark / light themes


---

this platform is a self host platform, which means user would self host by himself.
so always use proper coding standards, clean code, modular components and proper documents. not spamming comments.document setup, env setups,database ,resend,email setups etc.

## configurations

- i don't like any UI of this project. the theme is Ok ,but the UI ,componnent places,the way it used them i don't like.i need modern, easy understandable, guidable UI/UX.
when the user comes to the landing page first. he should understand what are the features, what can he do from this platform immedietly. (not with the text, visually show what he can do, ).then the login and register pages should be simple, but need and professional,modern. 
then send the the main dashboard. but this should be a guiding thing. i don't like the current sidebar dashboard thingy. this should be modern look. the user should navigate step by step.first in getting the user data. then twicking the cv and slowly sending to apply for jobs, then managing jobs.the user should feel like he waalking down from clouds step by step.the modern and easy thing.use animations. 

- create the properly modular email provider using he decorator pattern. options should be resend (which require to own a domain, )


## TODO:

- in the settings choose email method

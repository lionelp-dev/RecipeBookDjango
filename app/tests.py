from django.test import TestCase


class HomePageTests(TestCase):
    def test_home_embeds_the_hello_world_inertia_page(self):
        response = self.client.get("/")

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, '"component": "Home"')
        self.assertContains(response, '"message": "Hello World"')
